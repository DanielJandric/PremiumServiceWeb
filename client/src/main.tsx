import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { applyBrandFromLogo } from "@/lib/brand";

async function bootstrap() {
  // Apply brand colors derived from logo before first paint
  try {
    await applyBrandFromLogo("/logo-transparent.png");
  } catch {}

  // Inject analytics at runtime if env provided (Vercel or local)
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined;
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID as string | undefined;
  if (endpoint && websiteId) {
    const script = document.createElement("script");
    script.defer = true;
    script.src = `${endpoint.replace(/\/$/, "")}/umami`;
    script.setAttribute("data-website-id", websiteId);
    document.head.appendChild(script);
  }
  createRoot(document.getElementById("root")!).render(<App />);
}

bootstrap();
