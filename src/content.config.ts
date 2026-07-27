import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const publicationStatus = z.enum(["draft", "published"]).default("draft");

const fieldGuide = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/fieldguide" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: publicationStatus,
    updatedAt: z.coerce.date().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    status: publicationStatus,
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, fieldGuide };
