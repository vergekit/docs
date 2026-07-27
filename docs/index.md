# Introduction

Verge Kit is a foundation for building full-stack applications with Astro and
Cloudflare Workers.

It starts with the pieces most full-stack apps need: server-rendered Astro, D1,
Drizzle, Better Auth, email, middleware, Zod validation, Astro Actions, and a
plain Tailwind UI base. The project stays close to Astro, Cloudflare, Drizzle,
Better Auth, and Tailwind instead of adding a large custom framework layer.


## The Stack

- [Astro](https://astro.build) - SSR with strict
  [TypeScript](https://www.typescriptlang.org) and [Cloudflare Workers](https://workers.dev) adapter
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - SQLite databsae
- [Drizzle](https://orm.drizzle.team) - ORM, schema, migrations (w/ [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview))
- [Better Auth](https://www.better-auth.com) w/ [admin plugin](https://www.better-auth.com/docs/plugins/admin)
- [Tailwind](https://tailwindcss.com) - CSS utility classes
- [bejamas/ui](https://ui.bejamas.com) components (based on [shadcn/ui](https://ui.shadcn.com/))
- [Lucide Astro](https://lucide.dev/guide/astro) icons
- [React Email](https://react.email/) components and templates
- [Vitest](https://vitest.dev), [happy-dom](https://github.com/capricorn86/happy-dom), and [oxlint](https://oxc.rs/docs/guide/usage/linter.html), and integrated npm verification scripts



## The Boilerplate

- Lazy auth middleware with typed, request-scoped `Astro.locals`
- Public-by-default route authorization with opt-in protected pages and APIs
- CSRF origin checks through [Astro config](https://docs.astro.build/en/guides/security/)
- Custom 404 and 500 error pages
- D1-backed Drizzle schema, migrations, and typed database client
- Basic authentication flows (register, login, logout, email verification, forgot password, and reset password) with requisite email notifications
- Configurable user roles and permissions for `admin`, `moderator`, `user`, and `banned`
- Transactional email providers for console output,
  [Resend](https://resend.com), [Mailgun](https://www.mailgun.com),
  and [Cloudflare Email](https://developers.cloudflare.com/email-service/)
- Verification and helper scripts exposed through npm scripts




## Setup Flow

New projects start with:

```bash
npm create vergekit@latest
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
  db.ts          Drizzle D1 client and database boundary
  email/         React Email templates
  pages/         Astro pages and API routes
  middleware.ts  auth locals and route protection
```
