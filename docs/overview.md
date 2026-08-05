# Overview

Verge Kit is a toolkit for building web applications using [Astro](https://astro.build) and the [Cloudflare Workers](https://workers.dev) ecosystem. Its pre-wired stack provides a reliable, understandable starting point with minimal boilerplate.

The toolkit covers database access, UI components, schema validation, tests, deployment configuration, and transactional email. It also supplies middleware, basic authentication flows, route protection, user roles, and permissions.

A boilerplate with consistent project structure and clear conventions helps LLM-based coding agents produce reliable output.

## The Stack

- [Astro](https://astro.build) - SSR with strict
  [TypeScript](https://www.typescriptlang.org) and [Cloudflare Workers](https://workers.dev) adapter
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - default SQLite database
- [Drizzle](https://orm.drizzle.team) - ORM, schema, migrations (w/ [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview))
- [Better Auth](https://www.better-auth.com) w/ [admin plugin](https://www.better-auth.com/docs/plugins/admin)
- [Tailwind](https://tailwindcss.com) - CSS utility classes
- [bejamas/ui](https://ui.bejamas.com) components (based on [shadcn/ui](https://ui.shadcn.com/))
- [Lucide](https://lucide.dev/icons/) icons
- [astro-favicons](https://github.com/ACP-CODE/astro-favicons) - simplified favicon generation
- [React Email](https://react.email/) components and templates
- [VK Core](https://github.com/vergekit/core) utilites & runtime helpers
- [Zod](https://zod.dev/) schema validation
- [Vitest](https://vitest.dev), [happy-dom](https://github.com/capricorn86/happy-dom), [oxlint](https://oxc.rs/docs/guide/usage/linter.html), and integrated npm verification scripts



## The Boilerplate

- Lazy auth middleware with typed, request-scoped `Astro.locals`
- Basic authentication flows with requisite email notifications
- Public-by-default route authorization with opt-in protected pages and APIs
- CSRF origin checks through [Astro config](https://docs.astro.build/en/guides/security/)
- Custom 404 and 500 error pages
- Drizzle schema, migrations, and typed database client for the default D1 preset
- Configurable user roles and permissions for `admin`, `moderator`, `user`, and `banned`
- Transactional email providers for console output,
  [Resend](https://resend.com), [Mailgun](https://www.mailgun.com),
  and [Cloudflare Email](https://developers.cloudflare.com/email-service/)
- Verification and helper scripts exposed through npm scripts



## Application Structure

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
├── cli/                  # operational scripts, including init-admin
├── migrations/           # generated SQL and Drizzle metadata
├── tests/                # auth, database, email, HTTP, and config tests
├── astro.config.mjs      # Astro and Cloudflare adapter configuration
├── drizzle.config.ts     # Drizzle Kit configuration
└── wrangler.jsonc        # Worker bindings and non-secret runtime values
```
