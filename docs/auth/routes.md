# Route Protection

Routes are public by default. Use shared route rules or a local access rule.

## Use Middleware Rules

Add one page to `protectedExactPaths`:

```ts
export const authConfig = defineAuthConfig({
  routes: {
    protectedExactPaths: ['/dashboard', '/account'],
    protectedPrefixes: [],
    // ...
  },
  // ...
});
```

Add a route group to `protectedPrefixes`:

```ts
export const authConfig = defineAuthConfig({
  routes: {
    protectedExactPaths: ['/dashboard'],
    protectedPrefixes: ['/settings/'],
    // ...
  },
  // ...
});
```

End each prefix with a slash. The prefix `/settings/` matches `/settings/profile`, but it does not match `/settings-public`.

A prefix does not protect its index route. Add `/settings` to `protectedExactPaths` to protect the index route.

Astro route-group names do not appear in URLs. For `src/pages/(app)/dashboard.astro`, protect `/dashboard`.

An anonymous request redirects to `/login`. The URL includes the original destination:

```text
/login?redirectTo=%2Fdashboard
```

## Protect Admin Routes

Admin routes require a session and the `app:administer` permission:

```ts
export const authConfig = defineAuthConfig({
  routes: {
    adminExactPaths: ['/admin'],
    adminPrefixes: ['/admin/'],
    adminPermission: { app: ['administer'] },
    // ...
  },
  // ...
});
```

An anonymous user goes to `/login`. A signed-in user without permission receives a `403` response.

Set role permissions in `src/config/auth.ts`:

```ts
roleAppPermissions: {
  admin: ['access', 'moderate', 'administer'],
  moderator: ['access', 'moderate'],
  user: ['access'],
  banned: [],
},
```

See [Roles and Admin](/auth/roles-and-admin) for the default role policy.

## Use a Local Access Rule

If a route needs a custom redirect or response, use a local rule.

For an Astro page, load the session in the frontmatter:

```astro
---
const destination = `${Astro.url.pathname}${Astro.url.search}`;

await Astro.locals.loadAuthSession();

if (!Astro.locals.isAuthenticated) {
  return Astro.redirect(
    `/login?redirectTo=${encodeURIComponent(destination)}`,
  );
}
---
```

For an API route, return a `401` response:

```ts
import type { APIRoute } from 'astro';
import { jsonFailure, jsonSuccess } from '@vergekit/core/http';

export const POST: APIRoute = async ({ locals }) => {
  await locals.loadAuthSession();

  if (!locals.isAuthenticated) {
    return jsonFailure('Unauthorized', { status: 401 });
  }

  return jsonSuccess({ ok: true });
};
```

For a permission rule, use `userHasAppPermission`:

```ts
import { userHasAppPermission } from '@vergekit/core/auth';
import { authConfig } from '@/config/auth';

if (
  !userHasAppPermission(authConfig, Astro.locals.user, {
    app: ['moderate'],
  })
) {
  return new Response('Forbidden', { status: 403 });
}
```

A permission rule does not control access to individual records. Add an ownership rule for each private resource.

Read [Data Authorization and Ownership](/auth/data-authorization) for direct and relationship-based ownership rules.

## Keep Auth Endpoints Public

Keep `/api/auth/*` public. Sign-in, registration, verification, reset, session, callback, and sign-out requests use these endpoints.

## Run the Tests

After a middleware rule change, run the authentication and middleware tests:

```bash
npm run test -- tests/auth tests/middleware
```

For a local rule, test the route handler. Provide a `locals.loadAuthSession` function that sets the required auth state.
