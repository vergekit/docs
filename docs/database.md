# Database

Verge Kit uses [Cloudflare D1](https://developers.cloudflare.com/d1/) and Drizzle by default. For a self-hosted server, use the [Node.js + MySQL preset](/fieldguide/node-mysql).

The Drizzle schema is in `src/config/schema.ts`.

## Binding and usage

The default preset exposes D1 through the `DB` binding in `wrangler.jsonc`. See the [D1 binding reference](https://developers.cloudflare.com/workers/wrangler/configuration/#d1-databases) for configuration details.

Keep database queries in server modules.

Import the configured database client from `@/db`:

```ts
import { db } from '@/db';

const rows = await db.select().from(user);
```

## Schema and migrations

Drizzle Kit stores generated SQL and migration history in `migrations/`. Use the project scripts instead of `drizzle-kit push` or `drizzle-kit migrate`.

| Command | Task |
| --- | --- |
| `npm run db:generate` | Generate SQL from the schema |
| `npm run db:migrate:local` | Apply migrations to local D1 |
| `npm run db:migrate:remote` | Apply migrations to remote D1|

The migration flow is: edit the schema, generate SQL, review it, migrate locally, and commit the files. Migrate remote D1 before deploying dependent code.

See the [D1 migrations guide](https://developers.cloudflare.com/d1/reference/migrations/) for migration behavior and the [Time Travel guide](https://developers.cloudflare.com/d1/reference/time-travel/) for recovery.

<!-- ## Drizzle Studio

[Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview) may be used to inspect a remote D1 database:

```bash
CLOUDFLARE_ACCOUNT_ID=your-account-id \
CLOUDFLARE_DATABASE_ID=your-d1-database-id \
CLOUDFLARE_D1_TOKEN=your-api-token \
npm run db:studio
```

Keep `CLOUDFLARE_D1_TOKEN` out of `wrangler.jsonc` and version control. -->

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

Use a separate D1 database for each deployed environment. See the [Wrangler D1 command reference](https://developers.cloudflare.com/d1/wrangler-commands/) for more commands.
