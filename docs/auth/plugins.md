# Better Auth Plugins

The starter includes the [Better Auth admin plugin](https://better-auth.com/docs/plugins/admin). Other Better Auth plugins are optional.

Read the [plugin catalog](https://better-auth.com/docs/plugins) to select a plugin. Then read the page for that plugin before you change the application.

## Add a Server Plugin

Keep application plugin policy in `src/config/auth.ts`:

```ts
import { organization } from 'better-auth/plugins';
import {
  defineAuthConfig,
  type AuthServerPlugin,
} from '@vergekit/core/auth';

export const authConfig = defineAuthConfig({
  // ...
});

export const authServerPlugins = [
  organization(),
] satisfies AuthServerPlugin[];
```

Pass the same list to each `createAuthFromEnv()` call:

```ts
createAuthFromEnv({
  // ...
  authConfig,
  additionalPlugins: authServerPlugins,
});
```

The starter creates Better Auth in the auth API route and middleware. Keep both calls consistent.

## Add a Client Plugin

Some plugins supply browser functions. If the plugin page requires a client plugin, add it.

```ts
import { createAuthClient } from 'better-auth/client';
import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClientPlugins } from '@vergekit/core/auth';
import { authConfig } from '@/config/auth';

export const authClient = createAuthClient({
  plugins: createAuthClientPlugins(authConfig, [organizationClient()]),
});
```

`createAuthClientPlugins()` keeps the Verge Kit role definitions in the Better Auth client.

## Change Server Configuration

If a Better Auth value does not belong in `authConfig`, use `extendOptions`.

Apply the same function to each `createAuthFromEnv()` call. Different server configuration can produce different behavior in middleware and API routes.

## Complete the Integration

For each plugin, complete these tasks:

1. Add the required tables and fields to `src/config/schema.ts`.
2. Generate and apply a migration.
3. If the plugin changes the user or session type, update `src/env.d.ts`.
4. If the plugin sends email, add email templates.
5. Add tests for the plugin configuration and access policy.

See [Schema and Migrations](/docs/auth/schema-and-migrations) for the database workflow.
