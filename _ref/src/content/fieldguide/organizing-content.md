---
title: Organizing site content
description: How Blog and Field Guide content is stored, ordered, drafted, and published.
status: published
updatedAt: 2026-07-27
---

Verge Kit keeps long-form public content in Astro content collections. This provides a typed frontmatter schema while keeping the writing workflow close to ordinary Markdown.

## Choose the collection

Use the **Blog** for time-based updates and essays. Blog posts are sorted by publication date and may be grouped with tags.

Use the **Field Guide** for durable reference material. Guide articles are grouped into named sections and follow an explicit navigation order.

## Draft before publishing

Every article has a `status` field. New work should stay in draft until it is ready to appear on the public site.

```yaml
status: draft
```

Change the value to `published` when the article is ready. Draft entries are excluded from archive pages, navigation, tag pages, and static route generation.

## Order the Field Guide

The `fieldGuideNavigation` array is the single source of truth for section and article order:

```ts
export const fieldGuideNavigation = [
  {
    label: "Start Here",
    slugs: ["index", "organizing-content"],
  },
  {
    label: "Application Patterns",
    slugs: ["configuration"],
  },
];
```

Move a slug to reorder an article. Add another object to create a section. Published articles that are not listed remain accessible and appear in an automatic **More** section, which makes accidental omissions visible without breaking the site.
