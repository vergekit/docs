# Workflow Overview

Verge Kit projects follow a small loop: configure runtime values, migrate D1,
run server-first development locally, verify, then deploy through Cloudflare
Workers.

## 1. Configure

Use `src/config` for source-level app defaults and auth policy. Use
`wrangler.jsonc` for committed non-secret Worker runtime values:

```jsonc
{
  "vars": {
    "EMAIL_PROVIDER": "console",
  },
}
```

Use `.dev.vars` for local secrets and local-only overrides:

```bash
BETTER_AUTH_SECRET=your-local-secret
BETTER_AUTH_URL=http://localhost:4321
```

Use Wrangler secrets for deployed secrets.

## 2. Migrate

Apply migrations before testing auth or database-backed pages:

```bash
npm run db:migrate:local
```

After schema changes, generate a migration and apply it locally:

```bash
npm run db:generate
npm run db:migrate:local
```

## 3. Initialize

Create a verified local user with the `admin` role when the app needs an initial
login:

```bash
npm run init:admin
```

The script writes directly to D1 through Wrangler and does not need the dev
server to be running.

## 4. Develop

Start Astro in server mode:

```bash
npm run dev
```

Keep writes, auth, email, and validation on the server. Use Astro pages, API
routes, Actions, middleware, the local `src/db.ts` module, `@vergekit/core/email`,
and React Email templates in `src/email` before adding new app-specific
abstractions.

## 5. Verify

Run the full verification command before merging or deploying:

```bash
npm run verify
```

Use narrower commands while iterating:

```bash
npm run check
npm run lint
npm run test
npm run build
```

## 6. Deploy

For production, create the remote D1 database, set deployed secrets, apply remote
migrations, optionally create a remote user with the `admin` role, then deploy
through the project Cloudflare workflow.





# Common Commands

```bash
npm run dev                 # local Astro dev server
npm run build               # production build
npm run check               # Astro and TypeScript checks
npm run lint                # oxlint
npm run test                # Vitest
npm run verify              # check, lint, tests, build
npm run db:generate         # generate Drizzle migrations
npm run db:studio           # open Drizzle Studio for D1 HTTP
npm run db:migrate:local    # apply D1 migrations locally
npm run db:migrate:remote   # apply D1 migrations remotely
npm run init:admin          # create a verified D1 user with the admin role
```
