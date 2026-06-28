# Introduction

Verge Kit is a foundation for building full-stack applications with Astro and
Cloudflare Workers.

It starts with the pieces most full-stack apps need: server-rendered Astro, D1,
Drizzle, Better Auth, email, middleware, Zod validation, Astro Actions, and a
plain Tailwind UI base. The project stays close to Astro, Cloudflare, Drizzle,
Better Auth, and Tailwind instead of adding a large custom framework layer.

## Included

- Astro server app with strict TypeScript.
- Cloudflare Workers adapter.
- Cloudflare D1 as the supported runtime database.
- Drizzle schema and migrations.
- Better Auth with email/password, email verification, reset password, and D1
  storage.
- Register, login, logout, email verification, forgot password, and reset
  password flows.
- Middleware that loads auth state into typed `Astro.locals`.
- Public-by-default route auth with opt-in protected pages and APIs.
- API response helpers.
- Zod request parsing.
- Astro Actions example.
- Email providers for console, Cloudflare Email, Resend, Mailgun, and explicit
  Node SMTP usage.
- Auth email templates with `@backstro/email`.
- Tailwind CSS v4 and local Astro UI components.
- Lucide Astro icons.
- Vitest, happy-dom, oxlint, Prettier, and verification scripts.

## Setup Flow

New projects start with:

```bash
npm create vergekit@latest my-app
cd my-app
npm install
```

Local development uses `.dev.vars` for local secrets, `wrangler.jsonc` for
committed non-secret Worker configuration, and Wrangler secrets for deployed
secret values. Apply D1 migrations before running auth flows, then optionally
create a verified admin user with `npm run init:admin`.

## Runtime Shape

```text
src/
  actions/       Astro Actions
  auth/          Better Auth setup and route rules
  components/    local Astro UI components
  db/            Drizzle schema, clients, and query seams
  email/         providers and auth email templates
  lib/http/      JSON and Zod parsing helpers
  pages/         Astro pages and API routes
  middleware.ts  auth locals and route protection
```

## Not Included Yet

- Admin UI.
- RBAC.
- Uploads and storage adapters.
- Media processing.
- Production PostgreSQL or MySQL runtime support.

## Database Status

D1 is the only supported runtime database. Runtime code should use the local
`src/db` modules rather than importing `drizzle-orm/d1` directly from routes,
actions, middleware, or UI code.

The project has proof tests for future Hyperdrive PostgreSQL and MySQL support.
Those targets are not enabled at runtime.
