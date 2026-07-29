import { getCollection, type CollectionEntry } from "astro:content";
import { fieldGuideNavigation } from "../config/field-guide";

export interface FieldGuideNavEntry {
  href: string;
  slug: string;
  title: string;
}

export interface FieldGuideNavSection {
  label: string;
  entries: FieldGuideNavEntry[];
}

export function entrySlug(id: string) {
  return id.replace(/\.(md|mdx)$/, "").replace(/\/index$/, "");
}

export function fieldGuideHref(slug: string) {
  if (slug === "resources") return "/resources";
  return slug === "index" || slug === "" ? "/fieldguide" : `/fieldguide/${slug}`;
}

export function blogHref(slug: string) {
  return `/blog/${slug}`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export async function getPublishedBlogPosts() {
  const entries = await getCollection("blog", ({ data }) => data.status === "published");
  return entries.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export async function getFieldGuideSections(): Promise<FieldGuideNavSection[]> {
  const entries = await getCollection("fieldGuide", ({ data }) => data.status === "published");
  const bySlug = new Map(entries.map((entry) => [entrySlug(entry.id), entry]));
  const used = new Set<string>();

  const sections: FieldGuideNavSection[] = fieldGuideNavigation.map((section) => ({
    label: section.label,
    entries: section.slugs.flatMap((slug) => {
      const entry = bySlug.get(slug);
      if (!entry) return [];
      used.add(slug);
      return [{
        slug,
        title: entry.data.title,
        href: fieldGuideHref(slug),
      }];
    }),
  })).filter((section) => section.entries.length > 0);

  const unlisted = entries
    .map((entry) => ({ entry, slug: entrySlug(entry.id) }))
    .filter(({ slug }) => !used.has(slug))
    .sort((a, b) => a.entry.data.title.localeCompare(b.entry.data.title))
    .map(({ entry, slug }) => ({
      slug,
      title: entry.data.title,
      href: fieldGuideHref(slug),
    }));

  if (unlisted.length > 0) sections.push({ label: "More", entries: unlisted });
  return sections;
}

export async function getFieldGuidePrevNext(currentSlug: string) {
  const entries = (await getFieldGuideSections()).flatMap((section) => section.entries);
  const index = entries.findIndex((entry) => entry.slug === currentSlug);
  if (index < 0) return {};
  return {
    prev: index > 0 ? entries[index - 1] : undefined,
    next: index < entries.length - 1 ? entries[index + 1] : undefined,
  };
}

export type BlogEntry = CollectionEntry<"blog">;
