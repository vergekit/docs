import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const iconColor = "#151516";

const tools = [
  {
    label: "Astro",
    href: "https://astro.build",
    logo: "/tool-logos/astro.svg",
  },
  {
    label: "Cloudflare Workers",
    href: "https://workers.dev",
    logo: "/tool-logos/cloudflare-black.svg",
  },
  {
    label: "Drizzle",
    href: "https://orm.drizzle.team",
    logo: "/tool-logos/drizzle.svg",
  },
  {
    label: "Better Auth",
    href: "https://www.better-auth.com",
    logo: "/tool-logos/better-auth.svg",
  },
  {
    label: "Tailwind",
    href: "https://tailwindcss.com",
    logo: "/tool-logos/tailwind-css.svg",
  },
  {
    label: "bejamas/ui",
    href: "https://ui.bejamas.com",
    logo: "/tool-logos/bejamas-ui.svg",
  },
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("home page renders a local logo before each primary tool link label", () => {
  const source = readFileSync(
    path.join(rootDir, "src/pages/index.astro"),
    "utf8",
  );

  for (const tool of tools) {
    const anchor = source.match(
      new RegExp(
        `<a\\s+href="${escapeRegExp(tool.href)}"[\\s\\S]*?</a>`,
        "m",
      ),
    )?.[0];

    assert.ok(anchor, `${tool.label} link is present`);

    const logoIndex = anchor.indexOf(`src="${tool.logo}"`);
    const labelIndex = anchor.indexOf(`>${tool.label}<`);

    assert.notEqual(
      logoIndex,
      -1,
      `${tool.label} link references ${tool.logo}`,
    );
    assert.notEqual(labelIndex, -1, `${tool.label} keeps its link text`);
    assert.ok(logoIndex < labelIndex, `${tool.label} logo appears first`);
  }
});

test("tool logos are stored as local SVG assets", () => {
  for (const tool of tools) {
    const assetPath = path.join(rootDir, "public", tool.logo);
    const svg = readFileSync(assetPath, "utf8");
    const colors = svg.match(/#[0-9A-Fa-f]{6}\b/g) ?? [];

    assert.ok(existsSync(assetPath), `${tool.logo} exists`);
    assert.ok(svg.trimStart().startsWith("<svg"), `${tool.logo} is an SVG file`);
    assert.deepEqual(
      [...new Set(colors.map((color) => color.toUpperCase()))],
      [iconColor.toUpperCase()],
      `${tool.logo} only uses the black icon color`,
    );
  }
});

test("Cloudflare logo variants are available without removing Workers logo", () => {
  const variants = [
    {
      file: "cloudflare.svg",
      colors: ["#FAAE40", "#F38020"],
    },
    {
      file: "cloudflare-black.svg",
      colors: [iconColor],
    },
    {
      file: "cloudflare-workers.svg",
      colors: [iconColor],
    },
  ];

  for (const variant of variants) {
    const assetPath = path.join(rootDir, "public/tool-logos", variant.file);
    const svg = readFileSync(assetPath, "utf8");
    const colors = [...new Set(svg.match(/#[0-9A-Fa-f]{6}\b/g) ?? [])];

    assert.ok(existsSync(assetPath), `${variant.file} exists`);
    assert.ok(svg.includes("Cloudflare"), `${variant.file} identifies Cloudflare`);
    assert.deepEqual(
      colors.map((color) => color.toUpperCase()),
      variant.colors.map((color) => color.toUpperCase()),
      `${variant.file} has the expected colors`,
    );
  }
});

test("Astro logo variants are available", () => {
  const blackLogo = readFileSync(
    path.join(rootDir, "public/tool-logos/astro.svg"),
    "utf8",
  );
  const colorLogo = readFileSync(
    path.join(rootDir, "public/tool-logos/astro-light-gradient.svg"),
    "utf8",
  );

  assert.ok(blackLogo.includes("Astro"), "black Astro logo identifies Astro");
  assert.ok(
    blackLogo.includes(`fill="${iconColor}"`),
    "black Astro logo keeps the page icon color",
  );
  assert.ok(
    colorLogo.includes("<linearGradient"),
    "color Astro alternate keeps the gradient artwork",
  );
  assert.ok(
    colorLogo.includes("Astro"),
    "color Astro alternate identifies Astro",
  );
});
