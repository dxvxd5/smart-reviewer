/**
 * Smoke-test script to verify external service connectivity.
 * Usage (from repo root): npm run check:services --workspace=backend
 */
import "dotenv/config";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";

const ok = (msg: string) => console.log(`${GREEN}✔${RESET} ${msg}`);
const fail = (msg: string, err: unknown) => {
  const detail = err instanceof Error ? err.message : String(err);
  console.log(`${RED}✘${RESET} ${msg}\n  ${DIM}${detail}${RESET}`);
};

async function checkMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return fail("MongoDB", new Error("MONGODB_URI not set"));
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    const dbName = mongoose.connection.db?.databaseName ?? "(unknown)";
    ok(`MongoDB connected (db: ${dbName})`);
    await mongoose.disconnect();
  } catch (err) {
    fail("MongoDB", err);
  }
}

async function checkGNews() {
  const key = process.env.GNEWS_API_KEY;
  if (!key) return fail("GNews", new Error("GNEWS_API_KEY not set"));
  try {
    const url = `https://gnews.io/api/v4/search?q=test&max=1&apikey=${key}`;
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
    }
    const data = (await res.json()) as { totalArticles?: number; articles?: unknown[] };
    ok(
      `GNews responded (totalArticles=${data.totalArticles ?? 0}, articles=${data.articles?.length ?? 0})`,
    );
  } catch (err) {
    fail("GNews", err);
  }
}

async function checkGemini() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return fail("Gemini", new Error("GEMINI_API_KEY not set"));
  try {
    const ai = new GoogleGenerativeAI(key);
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Reply with the single word: pong");
    const text = result.response.text().trim();
    ok(`Gemini responded ("${text.slice(0, 40)}")`);
  } catch (err) {
    fail("Gemini", err);
  }
}

async function main() {
  console.log("Checking external services...\n");
  await checkMongo();
  await checkGNews();
  await checkGemini();
  console.log("\nDone.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
