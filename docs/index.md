# Introduction

Verge Kit is a foundation for building full-stack applications with Astro and
Cloudflare Workers.

It starts with the pieces most full-stack apps need: server-rendered Astro, D1,
Drizzle, Better Auth, email, middleware, Zod validation, Astro Actions, and a
plain Tailwind UI base. The project stays close to Astro, Cloudflare, Drizzle,
Better Auth, and Tailwind instead of adding a large custom framework layer.

## Included

- [Astro](https://astro.build) server app with strict
  [TypeScript](https://www.typescriptlang.org)
- [Cloudflare Workers](https://workers.dev) adapter
- [Cloudflare D1](https://developers.cloudflare.com/d1/) as the supported
  runtime database
- [Drizzle](https://orm.drizzle.team) schema and migrations
- [Better Auth](https://www.better-auth.com) with email/password, email
  verification, reset password, and D1 storage
- Better Auth [admin plugin](https://www.better-auth.com/docs/plugins/admin)
  roles for `admin`, `moderator`, `user`, and `banned`
- Register, login, logout, email verification, forgot password, and reset
  password flows
- Middleware that loads auth state into typed `Astro.locals`
- Public-by-default route auth with opt-in protected pages and APIs
- Custom 404 and 500 error pages
- API response helpers
- [Zod](https://zod.dev) request parsing
- [Astro Actions](https://docs.astro.build/en/guides/actions/) example
- CSRF origin checks through [Astro config](https://docs.astro.build/en/guides/security/)
- Email providers for console,
  [Cloudflare Email](https://developers.cloudflare.com/email-service/),
  [Resend](https://resend.com), and [Mailgun](https://www.mailgun.com)
- [React Email](https://react.email/) auth email templates
- [Tailwind CSS v4](https://tailwindcss.com) and local Astro UI components
- [Lucide Astro](https://lucide.dev/guide/astro) icons
- [Vitest](https://vitest.dev), [happy-dom](https://github.com/capricorn86/happy-dom),
  [oxlint](https://oxc.rs/docs/guide/usage/linter.html), 
  and verification scripts

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
create a verified user with the `admin` role with `npm run init:admin`.

## App structure

```text
src/
  actions/       Astro Actions
  auth/          Better Auth setup and route rules
  components/    local Astro UI components
  config/        source-level app and auth policy
  db/            Drizzle schema, clients, and query seams
  email/         React Email templates
  pages/         Astro pages and API routes
  middleware.ts  auth locals and route protection
```
