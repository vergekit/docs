# Roles and Admin

Verge Kit configures roles through the [Better Auth admin plugin](https://better-auth.com/docs/plugins/admin). Application permissions remain in `src/config/auth.ts`.

## Default Roles

| Role | Application permissions | Better Auth admin permissions |
| --- | --- | --- |
| `admin` | `access`, `moderate`, `administer` | User and session administration |
| `moderator` | `access`, `moderate` | None |
| `user` | `access` | None |
| `banned` | None | None |

The `user` role is the default role for new accounts. A stored role value can contain multiple comma-separated roles.

Use `userHasAppPermission()` for a local permission rule. Use the admin route policy for a shared administrator area.

See [Route Protection](/auth/routes) for both patterns.

## Admin Routes

The default policy reserves `/admin` and `/admin/*` for the `app:administer` permission.

The starter does not include an `/admin` page. If the application needs an admin interface, add one.

Better Auth supplies server and client functions for users, roles, bans, sessions, and impersonation. The starter schema includes the related admin fields.

## Create the First Admin

Apply migrations before you create the administrator.

Create a verified local administrator:

```bash
npm run init:admin
```

Create a verified remote administrator:

```bash
npm run init:admin -- --remote
```

The command writes directly to the database. The development server does not need to run.

## Banned Users

If the Better Auth `banned` field is true, the application denies access. The `banned` role also denies access.

A banned user cannot create a new session. A banned user with an existing session receives a `403` response on protected routes.

## Protect Sensitive Data

A protected route permits every signed-in user. Use an admin route or a permission rule for sensitive data.

Roles do not control access to individual records. Add ownership rules for private resources.

Read [Data Authorization and Ownership](/auth/data-authorization) for record-level rules.
