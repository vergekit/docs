import { z } from "astro/zod";
import resourceData from "../content/resources.json";

const resourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
});

export const resources = z.array(resourceSchema).parse(resourceData);
export type Resource = z.infer<typeof resourceSchema>;
