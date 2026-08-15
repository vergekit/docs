# Authentication

Verge Kit includes an email-and-password flow through [Better Auth](https://better-auth.com). The starter supplies the schema, pages, middleware, and email templates.

Use the Better Auth documentation for authentication behavior, session options, and additional sign-in methods:

- [Email and password](https://better-auth.com/docs/authentication/email-password)
- [Session management](https://better-auth.com/docs/concepts/session-management)
- [Astro integration](https://better-auth.com/docs/integrations/astro)
- [Plugins](https://better-auth.com/docs/plugins)

## Included Routes

The starter includes registration, sign-in, sign-out, email verification, password reset, and a protected dashboard.

The catch-all route at `/api/auth/*` supplies the Better Auth endpoints. Keep this route public.

## Project Files

| File | Purpose |
| --- | --- |
| `src/config/auth.ts` | Route rules, roles, permissions, and Better Auth extensions |
| `src/config/schema.ts` | Authentication tables and plugin fields |
| `src/pages/api/auth/[...all].ts` | Better Auth request handler |
| `src/middleware.ts` | Session loading and route access |
| `src/config/auth-email.ts` | Verification and password-reset email |

The starter creates Better Auth in the API handler and the middleware. Keep the server configuration and plugins identical in both locations.

If a change needs database fields, use the [Database](/database) migration workflow. If it changes user or session types, update `src/env.d.ts`.

## Access Control

Routes are public by default. Authentication does not grant access to every route or record.

Keep route rules, roles, and permissions in `src/config/auth.ts`. Keep record-level rules next to each server-side database query.

### Protect Routes

Add exact paths and path prefixes to the shared route rules:

```ts
export const authConfig = defineAuthConfig({
  routes: {
    protectedExactPaths: ['/dashboard', '/settings'],
    protectedPrefixes: ['/settings/'],
    adminExactPaths: ['/admin'],
    adminPrefixes: ['/admin/'],
    adminPermission: { app: ['administer'] },
  },
  // ...
});
```

- Add an index route to `protectedExactPaths`.
- End each prefix with a slash.
- Use the public URL. Astro route-group names do not appear in URLs.

Anonymous page requests go to `/login`. Anonymous API requests need a `401` response.

For a local API rule, load the session before the route uses authentication state:

```ts
export const POST: APIRoute = async ({ locals }) => {
  await locals.loadAuthSession();

  if (!locals.user) {
    return jsonFailure('Unauthorized', { status: 401 });
  }

  return jsonSuccess({ ok: true });
};
```

The request also provides `locals.session` and `locals.isAuthenticated`.

### Roles and Permissions

The starter uses these application roles:

| Role | Permissions |
| --- | --- |
| `admin` | `access`, `moderate`, `administer` |
| `moderator` | `access`, `moderate` |
| `user` | `access` |
| `banned` | None |

New accounts receive the `user` role. The `/admin` route rules require the `app:administer` permission.

Use `userHasAppPermission()` for a permission rule outside the shared route configuration.

Better Auth supplies administrator functions through its [admin plugin](https://better-auth.com/docs/plugins/admin). Verge Kit does not include an administrator interface.

### Protect Records

A protected route permits every signed-in user. It does not limit which records that user can read or change.

Use `locals.user.id` as the owner identity. Do not accept an owner ID from the client.

Include the record ID and owner ID in the same database query:

```ts
const [record] = await db
  .select()
  .from(project)
  .where(
    and(
      eq(project.id, projectId),
      eq(project.userId, locals.user.id),
    ),
  )
  .limit(1);
```

Apply the same rule to read, update, and delete operations. For shared records, include the user in the membership query.

If a record does not exist or the user cannot access it, return `404`. This response does not disclose another user's record.

Test that the owner has access. Test that another user and an anonymous request do not have access.

See [Security](/security) for request, session, redirect, and secret safeguards.
