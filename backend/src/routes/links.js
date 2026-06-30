import { Router } from "express";
import https from "https";
import http from "http";
import prisma from "../lib/prisma.js";

const router = Router();

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(
      url,
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; LinksManagerBot/1.0)" }, timeout: 8000 },
      (res) => {
        // Follow one redirect
        if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
          return fetchHtml(res.headers.location).then(resolve).catch(reject);
        }
        let html = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => { html += chunk; });
        res.on("end", () => resolve(html));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

function parseMeta(prop, html) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${prop}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

async function fetchMeta(url) {
  try {
    const html = await fetchHtml(url);
    const title =
      parseMeta("og:title", html) ||
      parseMeta("twitter:title", html) ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ||
      null;
    const description =
      parseMeta("og:description", html) ||
      parseMeta("twitter:description", html) ||
      parseMeta("description", html) ||
      null;
    const image =
      parseMeta("og:image", html) ||
      parseMeta("twitter:image", html) ||
      null;
    const favicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`;
    return { title, description, image, favicon };
  } catch {
    return { title: null, description: null, image: null, favicon: null };
  }
}

router.get("/", async (req, res, next) => {
  try {
    const { boardId } = req.query;
    const links = await prisma.link.findMany({
      where: boardId ? { boards: { some: { boardId: Number(boardId) } } } : undefined,
      orderBy: { createdAt: "desc" },
      include: { boards: { include: { board: true } } },
    });
    res.json(links);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { url, boardIds = [] } = req.body;
    if (!url?.trim()) return res.status(400).json({ error: "URL is required" });

    const meta = await fetchMeta(url.trim());

    const link = await prisma.link.create({
      data: {
        url: url.trim(),
        ...meta,
        boards: {
          create: boardIds.map((id) => ({ boardId: Number(id) })),
        },
      },
      include: { boards: { include: { board: true } } },
    });

    res.status(201).json(link);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/boards", async (req, res, next) => {
  try {
    const linkId = Number(req.params.id);
    const { boardIds } = req.body;

    await prisma.linkBoard.deleteMany({ where: { linkId } });

    if (boardIds?.length) {
      await prisma.linkBoard.createMany({
        data: boardIds.map((id) => ({ linkId, boardId: Number(id) })),
      });
    }

    const link = await prisma.link.findUnique({
      where: { id: linkId },
      include: { boards: { include: { board: true } } },
    });

    res.json(link);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.link.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
