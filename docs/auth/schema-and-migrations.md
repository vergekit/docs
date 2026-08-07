# Auth Schema and Migrations

Verge Kit keeps the Better Auth schema in `src/config/schema.ts`. The application uses the same schema for Drizzle queries and Better Auth.

Read the [Better Auth Drizzle adapter guide](https://better-auth.com/docs/adapters/drizzle) for adapter requirements. Use the Verge Kit migration workflow for application changes.

## Core Tables

| Table | Purpose |
| --- | --- |
| `user` | Profile, role, and ban fields |
| `session` | Session token, expiration, request data, and impersonation field |
| `account` | Password credentials and external provider data |
| `verification` | Email verification and password-reset tokens |

The initial migration includes these tables. Apply it before you use an auth flow.

## Add Plugin Schema

A plugin can require new tables or fields. The plugin page lists its schema requirements.

1. Add the required schema to `src/config/schema.ts`.
2. Generate a Drizzle migration.
3. Review the generated SQL.
4. Apply the migration to the local database.
5. Apply the migration to each deployed database.

```bash
npm run db:generate
npm run db:migrate:local
npm run db:migrate:remote
```

Do not edit an applied migration. Add a new migration for an existing application.

See [Database](/database) for the D1 migration workflow.

## Keep Types Consistent

If a plugin adds fields to the user or session value in `Astro.locals`, update `src/env.d.ts`.

Pass the complete schema object to each `createAuthFromEnv()` call. Then make sure that the middleware and API route use the same plugin configuration.

## Run the Tests

Run the auth tests after an auth schema change:

```bash
npm run test -- tests/auth
```

Run all project checks before deployment:

```bash
npm run verify
```
