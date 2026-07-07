# Roadmap

The first Verge Kit milestone is complete: it is an empty but deployable
Cloudflare Workers Astro app with a D1 database layer, Better Auth mounted,
middleware locals wired, email delivery seams, and a small database portability
plan for future Hyperdrive work.

## Architecture Principle

VK is D1-first and adapter-ready. The first implementation supports Cloudflare
D1 only, while app code imports database behavior through stable local modules
that can later route to real Hyperdrive-backed PostgreSQL or MySQL
implementations.

App query code should stay inside a conservative Drizzle query-builder subset
unless a dialect-specific helper is explicitly introduced.

## Slice Status

| Slice | Status | Goal |
| --- | --- | --- |
| Foundation | Done | Scaffold Astro on Cloudflare Workers with strict TypeScript, Tailwind 4, baseline tooling, and deployment config. |
| D1 Database Contract | Done | Add Drizzle D1 schema and a small local `src/db.ts` D1 client surface. |
| Auth Spine | Done | Add Better Auth config, D1-backed schema, auth route, typed locals, and middleware route guards. |
| Email Layer | Done | Add provider-based mailer with console, Cloudflare Email, Resend, and Mailgun; render auth emails with React Email. |
| Form And API Conventions | Done | Add Zod parsing helpers, standard JSON responses, and Astro Actions registration patterns. |
| Minimal Auth UI | Done | Add form components, Lucide Astro icons, login/register/reset/verify pages, custom 404/500 error pages, and a dashboard shell. |
| Operational Polish | Done | Add docs, example env files, D1 setup notes, ADRs, and CI-ready scripts. |
| Future Hyperdrive Notes | Done | Document the future D1-or-Hyperdrive implementation checklist without shipping PostgreSQL/MySQL placeholder code. |

## Dependency Policy

Prefer first-party Astro, Cloudflare, Better Auth, Drizzle, Tailwind, and Vitest
packages. Add helper packages only when they remove meaningful boilerplate or
are required by a chosen integration. Avoid adding UI/runtime libraries that
imply React, Vue, Svelte, or SPA-style app structure.

## Deferred By Design

These are useful but intentionally outside the current boilerplate scope:

- R2 uploads.
- Media processing.
- Image transforms.
- Admin CRUD screens.
- CLI generation beyond project and admin initialization.
- Queues and workflows.
- Analytics.
- CSP policy presets.
- Object storage adapters.
- Full RBAC admin UI.
- Data grids, charts, and toasts.
- Hyperdrive production support.
