import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import express from "express";
import cors from "cors";
import { isRateLimited } from "./rate_limit";
import { sendContactEmail } from "./email";

export const client = () =>
  createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
export const kvStore = "kv_store_067e96cc";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

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
    const ipHeader = req.headers["x-forwarded-for"];
    const ip = Array.isArray(ipHeader)
      ? ipHeader[0]
      : ipHeader?.split(",")[0]?.trim() || req.ip || "unknown";

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

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`SMTP contact server running on http://localhost:${PORT}`);
});
