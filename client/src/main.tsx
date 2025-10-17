import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { applyBrandFromLogo } from "@/lib/brand";

async function bootstrap() {
  // Apply brand colors derived from logo before first paint
  try {
    await applyBrandFromLogo("/logo-transparent.png");
  } catch {}
  createRoot(document.getElementById("root")!).render(<App />);
}

bootstrap();
