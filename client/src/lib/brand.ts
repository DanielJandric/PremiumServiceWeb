/*
  Extract a brand palette from the site logo and apply CSS variables at runtime.
  This derives a dominant brand color, computes a readable foreground, and a lighter accent.
*/

type Rgb = { r: number; g: number; b: number };

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function srgbToLuminance(rgb: Rgb): number {
  const toLinear = (channel: number) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(colorA: Rgb, colorB: Rgb): number {
  const l1 = srgbToLuminance(colorA);
  const l2 = srgbToLuminance(colorB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function pickReadableForeground(background: Rgb): string {
  const white: Rgb = { r: 255, g: 255, b: 255 };
  const nearBlack: Rgb = { r: 17, g: 17, b: 17 };
  const contrastWithWhite = contrastRatio(background, white);
  const contrastWithBlack = contrastRatio(background, nearBlack);
  // Prefer higher contrast; ensure at least ~4.5 when possible
  return contrastWithWhite >= contrastWithBlack ? "rgb(255 255 255)" : "rgb(17 17 17)";
}

function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r1) {
      h = ((g1 - b1) / delta) % 6;
    } else if (max === g1) {
      h = (b1 - r1) / delta + 2;
    } else {
      h = (r1 - g1) / delta + 4;
    }
  }
  h = Math.round(((h * 60) + 360) % 360);
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h, s, l };
}

function hslToRgb({ h, s, l }: { h: number; s: number; l: number }): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r1 = 0, g1 = 0, b1 = 0;
  if (0 <= h && h < 60) {
    r1 = c; g1 = x; b1 = 0;
  } else if (60 <= h && h < 120) {
    r1 = x; g1 = c; b1 = 0;
  } else if (120 <= h && h < 180) {
    r1 = 0; g1 = c; b1 = x;
  } else if (180 <= h && h < 240) {
    r1 = 0; g1 = x; b1 = c;
  } else if (240 <= h && h < 300) {
    r1 = x; g1 = 0; b1 = c;
  } else {
    r1 = c; g1 = 0; b1 = x;
  }
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function deriveAccentFromBrand(brand: Rgb): string {
  const hsl = rgbToHsl(brand);
  const adjusted = {
    h: hsl.h,
    s: clamp01(hsl.s * 1.05),
    l: clamp01(hsl.l + 0.10),
  };
  const rgb = hslToRgb(adjusted);
  return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
}

async function loadImageData(url: string, targetSize = 64): Promise<ImageData> {
  const image = new Image();
  image.decoding = "async";
  image.crossOrigin = "anonymous";
  image.src = url;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to load image"));
  });
  const canvas = document.createElement("canvas");
  const ratio = image.width / image.height || 1;
  const width = ratio >= 1 ? targetSize : Math.round(targetSize * ratio);
  const height = ratio >= 1 ? Math.round(targetSize / ratio) : targetSize;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(image, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

function computeDominantColor(imageData: ImageData): Rgb {
  const { data, width, height } = imageData;
  const bins = new Map<number, { sumR: number; sumG: number; sumB: number; count: number }>();
  const toBin = (value: number) => (value >> 4) & 0x0f; // 16 levels per channel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const a = data[idx + 3];
      if (a < 32) continue; // skip transparent pixels
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      // Skip near-white backgrounds
      if (r > 245 && g > 245 && b > 245) continue;
      const rBin = toBin(r);
      const gBin = toBin(g);
      const bBin = toBin(b);
      const key = (rBin << 8) | (gBin << 4) | bBin;
      const bin = bins.get(key) || { sumR: 0, sumG: 0, sumB: 0, count: 0 };
      bin.sumR += r; bin.sumG += g; bin.sumB += b; bin.count += 1;
      bins.set(key, bin);
    }
  }
  if (bins.size === 0) {
    return { r: 36, g: 99, b: 235 }; // Fallback brand-ish blue
  }
  let bestKey = 0;
  let bestCount = -1;
  for (const [key, bin] of bins) {
    if (bin.count > bestCount) {
      bestCount = bin.count;
      bestKey = key;
    }
  }
  const { sumR, sumG, sumB, count } = bins.get(bestKey)!;
  return { r: Math.round(sumR / count), g: Math.round(sumG / count), b: Math.round(sumB / count) };
}

function toRgbString({ r, g, b }: Rgb): string {
  return `rgb(${r} ${g} ${b})`;
}

function applyCssVariables(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

function getCacheKey(url: string): string {
  return `brand-palette:v1:${url}`;
}

export async function applyBrandFromLogo(logoUrl: string): Promise<void> {
  try {
    const cacheKey = getCacheKey(logoUrl);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as Record<string, string>;
      applyCssVariables(parsed);
      return;
    }
    const imageData = await loadImageData(logoUrl, 72);
    const brandRgb = computeDominantColor(imageData);
    const brand = toRgbString(brandRgb);
    const primaryForeground = pickReadableForeground(brandRgb);
    const accent = deriveAccentFromBrand(brandRgb);
    const vars = {
      "--brand": brand,
      "--primary": brand,
      "--primary-foreground": primaryForeground,
      "--accent": accent,
    };
    applyCssVariables(vars);
    localStorage.setItem(cacheKey, JSON.stringify(vars));
  } catch {
    // Non-fatal; keep defaults
  }
}


