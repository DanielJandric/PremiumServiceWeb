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
    app.use(
      "/api",
      basicAuth,
      createProxyMiddleware({
        target: CHAT_API_URL,
        changeOrigin: true,
        ws: true,
        // Preserve /api prefix to match backend routes
        // pathRewrite: { "^/api": "/api" },
        proxyTimeout: 120000,
      })
    );
  }

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
