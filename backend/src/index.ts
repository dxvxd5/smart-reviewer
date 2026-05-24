import express, { type Request, type Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { newsRouter } from "./routes/news.js";
import { articlesRouter } from "./routes/articles.js";

async function bootstrap() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const app = express();

  const allowedOrigins = env.CORS_ORIGIN.split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow non-browser callers (curl, health checks) with no Origin header.
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`Origin ${origin} not allowed by CORS`));
      },
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      env: env.NODE_ENV,
      mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      uptime: process.uptime(),
    });
  });

  // Routes
  app.use("/api/news", newsRouter);
  app.use("/api/articles", articlesRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(env.PORT, () => {
    console.log(`🚀 Backend listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
