import "dotenv/config";
import express from "express";
import cors from "cors";
import boardsRouter from "./routes/boards.js";
import linksRouter from "./routes/links.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ["http://localhost:5173", "chrome-extension://*"] }));
app.use(express.json());

app.use("/api/boards", boardsRouter);
app.use("/api/links", linksRouter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
