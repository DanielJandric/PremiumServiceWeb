import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // JSON parser for API endpoints
  app.use(express.json({ limit: "1mb" }));

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Basic Auth for internal routes and API
  const BASIC_USER = process.env.BASIC_AUTH_USER;
  const BASIC_PASS = process.env.BASIC_AUTH_PASS;
  function basicAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!BASIC_USER || !BASIC_PASS) return res.status(401).set("WWW-Authenticate", "Basic realm=\"Internal\"").send("Auth not configured");
    const header = req.headers.authorization || "";
    const [scheme, b64] = header.split(" ");
    if (scheme !== "Basic" || !b64) return res.status(401).set("WWW-Authenticate", "Basic realm=\"Internal\"").send("Unauthorized");
    const [user, pass] = Buffer.from(b64, "base64").toString().split(":");
    if (user === BASIC_USER && pass === BASIC_PASS) return next();
    return res.status(401).set("WWW-Authenticate", "Basic realm=\"Internal\"").send("Unauthorized");
  }

  // Proxy /api to CHAT_API_URL (protected)
  const CHAT_API_URL = process.env.CHAT_API_URL;
  if (CHAT_API_URL) {
    // Explicit proxy for chat endpoint
    app.use(
      "/api/openai",
      createProxyMiddleware({
        target: CHAT_API_URL,
        changeOrigin: true,
        proxyTimeout: 120000,
      })
    );

    // General API proxy (no auth to avoid double challenges in XHR)
    app.use(
      "/api",
      createProxyMiddleware({
        target: CHAT_API_URL,
        changeOrigin: true,
        ws: true,
        proxyTimeout: 120000,
      })
    );

    // Proxy template assets used by PDF renderer
    app.use(
      "/template",
      createProxyMiddleware({
        target: CHAT_API_URL,
        changeOrigin: true,
        proxyTimeout: 120000,
      })
    );
  }

  // Fallback BFF: chat endpoint that adapts to backend or uses OpenAI directly if configured
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages = [], stream = false } = req.body ?? {};
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      // Try backend /api/openai first
      if (CHAT_API_URL) {
        const r1 = await fetch(`${CHAT_API_URL.replace(/\/$/, "")}/api/openai`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages, stream }),
          signal: controller.signal,
        });
        if (r1.ok) {
          clearTimeout(timeout);
          const data = await r1.json();
          const reply =
            data?.reply ?? data?.content ?? data?.choices?.[0]?.message?.content ?? "";
          return res.status(200).json({ reply });
        }
        // Try alternate path /api/chat (some backends expose this)
        const lastUser = Array.isArray(messages)
          ? [...messages].reverse().find((m) => m?.role === "user")?.content ?? ""
          : "";
        const r2 = await fetch(`${CHAT_API_URL.replace(/\/$/, "")}/api/chat`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ prompt: lastUser, messages }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (r2.ok) {
          const data = await r2.json();
          const reply = data?.reply ?? data?.content ?? "";
          return res.status(200).json({ reply });
        }
      }

      // Fallback direct to OpenAI if OPENAI_API_KEY configured
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (OPENAI_API_KEY) {
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({ model: "gpt-4o-mini", messages, stream: false }),
        });
        const data = await r.json();
        const reply = data?.choices?.[0]?.message?.content ?? "";
        return res.status(200).json({ reply });
      }

      return res.status(502).json({ error: "Chat backend unavailable" });
    } catch (e) {
      return res.status(502).json({ error: "Chat request failed" });
    }
  });

  // Protect internal page path
  app.use("/internal", basicAuth);

  // Health check endpoint for platforms like Render
  app.get("/health", (_req, res) => {
    res.status(200).send("OK");
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = Number(process.env.PORT) || 3000;
  const host = "0.0.0.0";

  server.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}/`);
  });
}

startServer().catch(console.error);
