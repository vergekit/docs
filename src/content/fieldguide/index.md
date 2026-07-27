---
title: Field Guide
description: Practical, opinionated recipes for building applications with the Verge Kit stack.
status: published
updatedAt: 2026-07-27
---

The Field Guide is the practical companion to the documentation. The docs explain Verge Kit itself; these articles capture the patterns, tradeoffs, and small decisions that come up while building an application with it.

## How to use this guide

Articles are grouped by topic in the sidebar and arranged in a deliberate reading order. You can read the guide from beginning to end or jump directly to the recipe you need.

Each article should aim to include:

- The problem and the constraints around it
- The preferred Verge Kit approach
- A complete example or code sample
- Tradeoffs and situations where another approach may fit better

## Adding an article

Create a Markdown file in `src/content/fieldguide/`, then add its slug to `src/config/field-guide.ts` to place it in the sidebar.

```yaml
---
title: A useful article title
description: One sentence that explains what the reader will learn.
status: published
updatedAt: 2026-07-27
---
```

New articles default to draft status, so unfinished work will not appear in navigation or generate a public route.
