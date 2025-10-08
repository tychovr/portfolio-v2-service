import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import express from "express";
import cors from "cors";
import { incrementRateLimit, isRateLimited } from "./src/database/rate_limit";
import { sendContactEmail } from "./src/database/email";

export const client = () =>
  createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

export const kvStore = "kv_store_067e96cc";

const corsOptions: cors.CorsOptions = {
  origin: [
    "http://localhost:3000",
    "https://tychovanrosmalen.nl",
    "http://0.0.0.0:3000/",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  optionsSuccessStatus: 204,
};

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors(corsOptions));

app.get('/health', (_req, res) => res.send('ok'));

app.options("/send-contact", (_req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.sendStatus(204);
});

app.post("/send-contact", async (req, res) => {
  try {
    const ip = req.ip || "unknown";

    if (await isRateLimited(ip)) {
      return res.status(429).json({
        success: false,
        error: "Rate limit exceeded. Try again in 15 minutes.",
      });
    }

    const body = req.body || {};
    if (!body.name || !body.email || !body.subject || !body.message) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, email, subject, message",
      });
    }

    const result = await sendContactEmail(body);

    incrementRateLimit(ip);
    return res.json({
      success: true,
      message: "Email sent successfully",
      messageId: result.messageId,
    });
  } catch (err) {
    console.error("Email error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to send email" });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = Number(process.env.PORT) || 8787;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`SMTP contact server running on http://${HOST}:${PORT}`);
});
