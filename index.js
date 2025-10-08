"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kvStore = exports.client = void 0;
require("dotenv/config");
const supabase_js_1 = require("@supabase/supabase-js");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const rate_limit_1 = require("./src/database/rate_limit");
const email_1 = require("./src/database/email");
const client = () => (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "");
exports.client = client;
exports.kvStore = "kv_store_067e96cc";
const corsOptions = {
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
const app = (0, express_1.default)();
app.set("trust proxy", true);
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
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
        if (await (0, rate_limit_1.isRateLimited)(ip)) {
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
        const result = await (0, email_1.sendContactEmail)(body);
        (0, rate_limit_1.incrementRateLimit)(ip);
        return res.json({
            success: true,
            message: "Email sent successfully",
            messageId: result.messageId,
        });
    }
    catch (err) {
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
