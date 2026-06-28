# Workflow Overview

Verge Kit projects follow a small loop: configure runtime values, migrate D1,
run server-first development locally, verify, then deploy through Cloudflare
Workers.

## 1. Configure

Use `wrangler.jsonc` for committed non-secret Worker values:

```jsonc
{
  "vars": {
    "APP_NAME": "VK",
    "DATABASE_TARGET": "d1",
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

Create a verified local admin user when the app needs an initial login:

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
routes, Actions, middleware, and the local `src/db` and `src/email` modules
before adding new app-specific abstractions.

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
migrations, optionally create a remote admin user, then deploy with Wrangler or
CI.
