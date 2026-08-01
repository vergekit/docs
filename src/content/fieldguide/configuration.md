---
title: Runtime configuration patterns
description: Keep public configuration, server-only values, and secrets in the right runtime boundary.
status: published
updatedAt: 2026-07-27
---

This draft is a starting point for a future Field Guide article about runtime configuration.

```ts
const database = context.locals.runtime.env.DB;
```
