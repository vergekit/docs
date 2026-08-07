# Extending User Names

Better Auth uses `name` as its standard display-name field. Keep this field for compatibility with auth APIs, email templates, and plugins.

Many apps, however, will need to separate first and last names for business logic reasons. This guide helps add `firstName` and `lastName` as application fields and uses them to build `name` content during registration.

## 1. Add the database fields

Add both fields to the `user` table in `src/config/schema.ts`:

```ts
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  firstName: text('firstName'),
  lastName: text('lastName'),
  // Keep the other fields.
});
```

The nullable fields keep an existing database migration safe. Require both values for new registrations in the next step.

Generate and apply the migration:

```bash
npm run db:generate
npm run db:migrate:local
```

Review the generated SQL before you apply it to a remote database.

## 2. Tell Better Auth about the fields

Add one shared extension function to `src/config/auth.ts`:

```ts
import type { BetterAuthOptions } from 'better-auth';

export function extendAuthOptions(
  options: BetterAuthOptions,
): BetterAuthOptions {
  return {
    ...options,
    user: {
      ...options.user,
      additionalFields: {
        ...options.user?.additionalFields,
        firstName: {
          type: 'string',
          required: true,
          input: true,
        },
        lastName: {
          type: 'string',
          required: true,
          input: true,
        },
      },
    },
  };
}
```

Pass `extendAuthOptions` to every `createAuthFromEnv()` call:

```ts
import { authConfig, extendAuthOptions } from '@/config/auth';

const auth = createAuthFromEnv({
  // Keep the existing values.
  authConfig,
  extendOptions: extendAuthOptions,
});
```

Make this change in these files:

- `src/middleware.ts`
- `src/pages/api/auth/[...all].ts`

The API call accepts the fields. The middleware call returns the fields with each loaded user.

Add an application user type near the top of `src/env.d.ts`:

```ts
type ApplicationUser = import('@vergekit/core/auth').AppAuthUser & {
  firstName?: string | null;
  lastName?: string | null;
};
```

Use `ApplicationUser` for both `user` properties in `App.Locals`:

```ts
interface Locals {
  user: ApplicationUser | null;
  // Keep the other fields.
  loadAuthSession: () => Promise<{
    user: ApplicationUser;
    session: import('@vergekit/core/auth').AppAuthSession;
  } | null>;
}
```

Read the Better Auth guide for [additional user fields](https://better-auth.com/docs/concepts/database#extending-core-schema).

## 3. Change the registration form

Replace the name field in `src/pages/register.astro` with these fields:

```astro
<Field>
  <FieldLabel for="register-first-name">First name</FieldLabel>
  <Input
    id="register-first-name"
    name="firstName"
    autocomplete="given-name"
    required
  />
</Field>

<Field>
  <FieldLabel for="register-last-name">Last name</FieldLabel>
  <Input
    id="register-last-name"
    name="lastName"
    autocomplete="family-name"
    required
  />
</Field>

<input id="register-name" name="name" type="hidden" />

<script>
  const firstName = document.querySelector<HTMLInputElement>(
    '#register-first-name',
  );
  const lastName = document.querySelector<HTMLInputElement>(
    '#register-last-name',
  );
  const name = document.querySelector<HTMLInputElement>('#register-name');

  const syncName = () => {
    if (firstName && lastName && name) {
      name.value = `${firstName.value} ${lastName.value}`.trim();
    }
  };

  firstName?.addEventListener('input', syncName);
  lastName?.addEventListener('input', syncName);
  document
    .querySelector<HTMLFormElement>('form[data-auth-form]')
    ?.addEventListener('submit', syncName, { capture: true });
</script>
```

The shared auth form code sends all three values to Better Auth.

## 4. Change user displays and editors

Use one fallback while old users still have empty fields:

```ts
const displayName =
  [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
  user?.name ||
  user?.email ||
  'Authenticated user';
```

Update user tables, profile forms, and administrator forms. Include both fields in each Drizzle selection that needs them.

The current boilerplate also uses `name` in `src/pages/dashboard.astro` and `cli/init-admin.ts`. Keep `name` as the derived display name.

In `cli/init-admin.ts`, collect both names and add both columns to the user insert. Build `name` from the two values.

Find the remaining uses:

```bash
rg -n 'user\.name|userTable\.name|name:' src cli tests
```

## 5. Complete the change

Add first and last names to existing users through an administrator form or a reviewed migration. Do not split old names automatically.

Then run all project checks:

```bash
npm run verify
```
