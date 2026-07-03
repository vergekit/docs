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
    logo: "/tool-logos/astro-light-gradient.svg",
  },
  {
    label: "Cloudflare Workers",
    href: "https://workers.dev",
    logo: "/tool-logos/cloudflare.svg",
  },
  {
    label: "Drizzle",
    href: "https://orm.drizzle.team",
    logo: "/tool-logos/drizzle-color.svg",
  },
  {
    label: "Better Auth",
    href: "https://www.better-auth.com",
    logo: "/tool-logos/better-auth-color.svg",
  },
  {
    label: "Tailwind",
    href: "https://tailwindcss.com",
    logo: "/tool-logos/tailwind-css-color.svg",
  },
  {
    label: "bejamas/ui",
    href: "https://ui.bejamas.com",
    logo: "/tool-logos/bejamas-ui-color.svg",
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

    assert.ok(existsSync(assetPath), `${tool.logo} exists`);
    assert.ok(svg.trimStart().startsWith("<svg"), `${tool.logo} is an SVG file`);
  }
});

test("black logo alternates are still available", () => {
  const variants = [
    {
      file: "astro.svg",
      label: "Astro",
    },
    {
      file: "cloudflare-black.svg",
      label: "Cloudflare",
    },
    {
      file: "cloudflare-workers.svg",
      label: "Cloudflare Workers",
    },
    {
      file: "drizzle.svg",
      label: "Drizzle",
    },
    {
      file: "better-auth.svg",
      label: "Better Auth",
    },
    {
      file: "tailwind-css.svg",
      label: "Tailwind CSS",
    },
    {
      file: "bejamas-ui.svg",
      label: null,
    },
  ];

  for (const variant of variants) {
    const assetPath = path.join(rootDir, "public/tool-logos", variant.file);
    const svg = readFileSync(assetPath, "utf8");
    const colors = [...new Set(svg.match(/#[0-9A-Fa-f]{6}\b/g) ?? [])];

    assert.ok(existsSync(assetPath), `${variant.file} exists`);
    if (variant.label) {
      assert.ok(svg.includes(variant.label), `${variant.file} identifies ${variant.label}`);
    }
    assert.deepEqual(
      colors.map((color) => color.toUpperCase()),
      [iconColor.toUpperCase()],
      `${variant.file} remains the black alternate`,
    );
  }
});

test("color logo alternates are available for every primary tool", () => {
  const variants = [
    {
      file: "astro-light-gradient.svg",
      expected: ["<linearGradient", "#D83333", "#F041FF"],
    },
    {
      file: "cloudflare.svg",
      expected: ["#FAAE40", "#F38020"],
    },
    {
      file: "drizzle-color.svg",
      expected: ["#C5F74F"],
    },
    {
      file: "better-auth-color.svg",
      expected: ["#FFFFFF"],
    },
    {
      file: "tailwind-css-color.svg",
      expected: ["#06B6D4"],
    },
    {
      file: "bejamas-ui-color.svg",
      expected: ['fill="#fff"'],
    },
  ];

  for (const variant of variants) {
    const assetPath = path.join(rootDir, "public/tool-logos", variant.file);
    const svg = readFileSync(assetPath, "utf8");

    assert.ok(existsSync(assetPath), `${variant.file} exists`);
    assert.ok(svg.trimStart().startsWith("<svg"), `${variant.file} is an SVG file`);
    for (const expected of variant.expected) {
      assert.ok(svg.includes(expected), `${variant.file} includes ${expected}`);
    }
  }
});
