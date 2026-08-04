# Workflow

Use this sequence for local development and deployment.

## 1. Configure

Put committed Worker values in `wrangler.jsonc`:

```jsonc
{
  "vars": {
    "EMAIL_PROVIDER": "console",
  },
}
```

Put local secrets and overrides in `.dev.vars`:

```bash
BETTER_AUTH_SECRET=your-local-secret
BETTER_AUTH_URL=http://localhost:4321
```

Use Wrangler secrets for deployed secrets.

## 2. Migrate

After a schema change, generate and apply a local migration:

```bash
npm run db:generate
npm run db:migrate:local
```

See [Schema and Migrations](/docs/database#schema-and-migrations) for the complete process.

## 3. Create an Administrator

Create a verified local user with the `admin` role:

```bash
npm run init:admin
```

This command writes directly to D1. The development server does not need to run.

## 4. Develop

Start the development server:

```bash
npm run dev
```

Keep authentication, database writes, email, and input validation on the server.

## 5. Run Checks

Before you merge or deploy, run all project checks:

```bash
npm run verify
```

During development, you can run one check at a time:

```bash
npm run check
npm run lint
npm run test
npm run build
```

## Add a Database-Backed Feature

If a feature needs a schema change, use this sequence:

1. Add the table, fields, foreign keys, and indexes to `src/config/schema.ts`.
2. Run `npm run db:generate`.
3. Review the generated SQL in `migrations/`.
4. Run `npm run db:migrate:local`.
5. Put the database code in a server module that imports `db` from `@/db`.
6. Parse all request input on the server.
7. Add route, permission, and ownership rules.
8. Add tests for valid, anonymous, non-permitted, and wrong-owner requests.
9. Run `npm run verify`.
10. Before you deploy code that uses the new schema, apply the remote migration.

Read [Data Authorization and Ownership](/docs/auth/data-authorization) for record-level rules.

## 6. Deploy

Create the remote D1 database before the first deployment. Then add secrets and apply remote migrations.

See [Deployment Setup](/docs/deployment) for the deployment steps.

## Common Commands

```bash
npm run dev                 # local Astro dev server
npm run build               # production build
npm run preview             # local preview of the production build
npm run check               # Astro and TypeScript checks
npm run lint                # oxlint
npm run test                # Vitest
npm run test:watch          # Vitest watch mode
npm run verify              # check, lint, tests, build
npm run email               # React Email template preview
npm run db:generate         # generate Drizzle migrations
npm run db:studio           # open Drizzle Studio for D1 HTTP
npm run db:migrate:local    # apply D1 migrations locally
npm run db:migrate:remote   # apply D1 migrations remotely
npm run init:admin          # create a verified D1 user with the admin role
```

`npm run verify` runs `check`, `lint`, `test`, and `build` in that order.

`npm run db:generate` creates migration files. It does not apply the migration.

`npm run init:admin` writes directly to the selected database. Use `-- --remote` to select the remote D1 database.

See [Database](/docs/database) for migration commands. See [Email](/docs/email) for the email preview and provider configuration.
