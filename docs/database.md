# Database

Verge Kit includes two database presets:

- Cloudflare Workers with [Cloudflare D1](https://developers.cloudflare.com/d1/) is the default and primary preset.
- The [Node.js + MySQL preset](/fieldguide/node-mysql) is the alternative for a self-hosted Node.js server.

This page covers the default D1 preset. It uses Drizzle with the schema in `src/config/schema.ts`.

## D1 Binding

The default preset exposes D1 through a binding named `DB`. The binding is in `wrangler.jsonc`:

See the [Wrangler D1 binding reference](https://developers.cloudflare.com/workers/wrangler/configuration/#d1-databases) for all binding options.

## Usage

Keep database queries in server modules.

Import the configured database client from `@/db`:

```ts
import { db } from '@/db';

const rows = await db.select().from(user);
```


## Schema and Migrations

These files define and track the D1 schema:

| Path | Purpose |
| --- | --- |
| `src/config/schema.ts` | Drizzle table definitions |
| `drizzle.config.ts` | Drizzle Kit configuration |
| `migrations/*.sql` | Generated SQL migrations |
| `migrations/meta/` | Drizzle migration history |

For each schema change:

1. Update the tables, fields, foreign keys, and indexes in `src/config/schema.ts`.
2. Generate a migration.
3. Review the new SQL in `migrations/`.
4. Apply the migration to local D1.
5. Commit the schema and migration files.

Generate a new migration:

```bash
npm run db:generate
```

Apply migrations to local D1:

```bash
npm run db:migrate:local
```

Apply migrations to remote D1:

```bash
npm run db:migrate:remote
```

NOTE: `db:generate` creates SQL files. It does not apply them.

Use these scripts instead of `drizzle-kit push` or `drizzle-kit migrate`. Read the [D1 migrations guide](https://developers.cloudflare.com/d1/reference/migrations/) for more details.

## Migration Safety

Treat each applied migration as permanent history. Do not edit or rename an applied migration.

If you need another schema change, update the Drizzle schema. Then generate a new migration.

Commit the new SQL file and migration metadata.

Apply each migration to local D1 before remote D1. Review the generated SQL before each apply command.

Before a remote migration, make sure that the command uses the correct database and Wrangler environment.

Wrangler records applied migration names in the `d1_migrations` table. Wrangler captures a backup after each remote apply operation.

If a migration fails, Wrangler rolls back that migration. Earlier successful migrations remain applied.

Cloudflare D1 Time Travel can restore a database after a bad schema change.

Before a production migration, read the [Time Travel guide](https://developers.cloudflare.com/d1/reference/time-travel/).

CAUTION: Before a Time Travel restore, make sure that you select the correct database and restore point. The restore overwrites the current database.

## Drizzle Studio

Use Drizzle Studio to inspect a remote D1 database:

```bash
CLOUDFLARE_ACCOUNT_ID=your-account-id \
CLOUDFLARE_DATABASE_ID=your-d1-database-id \
CLOUDFLARE_D1_TOKEN=your-api-token \
npm run db:studio
```

Keep `CLOUDFLARE_D1_TOKEN` out of `wrangler.jsonc` and version control.

## Production D1

Create the production database once:

```bash
npx wrangler d1 create vk
```

Copy the returned `database_id` into the `DB` binding in `wrangler.jsonc`.

Apply the migrations before you deploy code that needs them:

```bash
npm run db:migrate:remote
```

Use a separate D1 database for each deployed environment. See the [Wrangler D1 command reference](https://developers.cloudflare.com/d1/wrangler-commands/) for additional commands.
