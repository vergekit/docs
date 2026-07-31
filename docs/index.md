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



## App structure

The generated project keeps application code in `src` and operational tooling
at the project root. The key directories and files are:

```text
./
├── src/
│   ├── actions/          # Astro Actions
│   ├── components/
│   │   ├── auth/         # shared authentication UI
│   │   └── ui/           # local bejamas/ui components
│   ├── config/           # app, auth, email, and database schema
│   ├── email/            # React Email templates
│   ├── layouts/          # base and authenticated page shells
│   ├── lib/              # shared application utilities
│   ├── pages/
│   │   ├── api/          # auth, health, and debug endpoints
│   │   └── auth/         # verification and password recovery
│   ├── styles/           # global Tailwind styles
│   ├── db.ts             # typed Drizzle D1 boundary
│   ├── env.d.ts          # Astro locals and Worker binding types
│   ├── middleware.ts     # request auth and route protection
│   └── runtime.ts        # request-scoped Cloudflare runtime access
├── cli/                 # operational scripts, including init-admin
├── migrations/          # generated SQL and Drizzle metadata
├── tests/               # auth, database, email, HTTP, and config tests
├── astro.config.mjs     # Astro and Cloudflare adapter configuration
├── drizzle.config.ts    # Drizzle Kit configuration
└── wrangler.jsonc       # Worker bindings and non-secret runtime values
```
