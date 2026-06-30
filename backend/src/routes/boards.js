import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const boards = await prisma.board.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { links: true } } },
    });
    res.json(boards);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, color } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Name is required" });
    const board = await prisma.board.create({ data: { name: name.trim(), color: color || "#6366f1" } });
    res.status(201).json(board);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { name, color } = req.body;
    const board = await prisma.board.update({
      where: { id: Number(req.params.id) },
      data: { ...(name && { name: name.trim() }), ...(color && { color }) },
    });
    res.json(board);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.board.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
