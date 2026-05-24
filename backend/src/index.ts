import express, { type Request, type Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { env } from "./config/env.js";

async function bootstrap() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      env: env.NODE_ENV,
      mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      uptime: process.uptime(),
    });
  });

  // Routes (to be added in Phase 2)
  // app.use("/api/news", newsRouter);
  // app.use("/api/articles", articlesRouter);

  app.listen(env.PORT, () => {
    console.log(`🚀 Backend listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
