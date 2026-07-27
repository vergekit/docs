---
title: A home for Verge Kit field notes
description: Why the public site now separates reference documentation, practical recipes, and project writing.
publishedAt: 2026-07-27
status: published
tags:
  - project
  - field-guide
---

Verge Kit has more to explain than a documentation tree can comfortably hold. Installation steps and API details belong in the docs, but implementation recipes, project decisions, and longer-form notes need different reading experiences.

## Three kinds of content

The public site now treats its content as three related collections:

1. **Docs** remain the concise reference for installing and operating Verge Kit.
2. **Field Guide** articles collect practical, opinionated solutions and code samples.
3. **Blog** posts provide a chronological place for updates and broader ideas.

This separation keeps the docs focused without hiding the context that makes the underlying decisions useful.

## Simple files, explicit structure

Both new sections are made from Markdown files with validated frontmatter. A Blog post includes a date and tags:

```yaml
---
title: A post title
description: A useful summary of the post.
publishedAt: 2026-07-27
status: published
tags: [project, release]
---
```

The Field Guide uses an explicit configuration file for section and article order. That gives the guide a curated path while the Blog remains a date-sorted feed.
