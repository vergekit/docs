# Data Authorization and Ownership

Authentication identifies a user. Route protection controls access to a route. Data authorization controls access to each record.

Verge Kit does not include a collection ownership system.

Add ownership rules to the server code for each protected resource.

## Use the Server Identity

Load the session before you read or write private data:

```ts
await locals.loadAuthSession();

if (!locals.user) {
  return jsonFailure('Unauthorized', { status: 401 });
}
```

Use `locals.user.id` as the user identity. Do not accept an owner ID from form data or JSON.

For a new record, set the owner ID in the server code:

```ts
await db.insert(project).values({
  id: crypto.randomUUID(),
  userId: locals.user.id,
  title: input.title,
});
```

The examples on this page use an application table named `project`.

Change the names to match your schema.

## Scope Each Database Query

Include the record ID and the owner ID in one database query:

```ts
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { project } from '@/config/schema';

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

Apply the same ownership rule to update and delete operations.

CAUTION: Do not change a private record with an unscoped query. This query can bypass the ownership rule.

If the query does not return an accessible record, return `404`.

This response does not disclose a record that belongs to another user.

## Add Relationship Ownership

Some records belong to a team or an organization.

For these records, use a membership table for the ownership rule.

Use this sequence for a relationship rule:

1. Load the authenticated user.
2. Read the membership for the user and the resource.
3. Make sure that the membership grants the required action.
4. Run the data query with the same team or organization ID.

Do not trust a team ID from the client. Make sure that the membership query includes the authenticated user ID.

The Better Auth organization plugin can supply organization roles and membership data. The application still controls access to its own records.

## Combine Permissions and Ownership

A permission answers which action a user can do. An ownership rule answers which record the user can access.

For a resource that needs both controls, use both rules:

```ts
if (
  !userHasAppPermission(authConfig, locals.user, {
    app: ['moderate'],
  })
) {
  return jsonFailure('Forbidden', { status: 403 });
}
```

Then scope the database query to the permitted owner, team, or organization.

An administrator can have access to all records.

Define this exception in server code. Then add tests for the exception.

## Select a Response Status

Use these response statuses:

| Status | Use |
| --- | --- |
| `401` | The request has no valid session |
| `403` | The user is authenticated but does not have the required application permission |
| `404` | The record does not exist, or the user cannot access the record |

Use one policy for each resource. Do not disclose private record existence through different error messages.

## Do Ownership Tests

For each private resource, add these tests:

1. Make sure that the owner can read and change the record.
2. Make sure that another user cannot read or change the record.
3. Make sure that an anonymous request returns `401` or redirects to the login page.
4. Make sure that each permitted role has the correct access.
5. Make sure that each non-permitted role receives `403`.
6. Make sure that a client-supplied owner ID cannot change ownership.

Run the authentication, middleware, and resource tests after each authorization change.

## Related Pages

- [Route Protection](/auth/routes) explains route and permission rules.
- [Roles and Admin](/auth/roles-and-admin) explains the default roles.
- [Security](/security) explains request and session safeguards.
- [Database](/database) explains schema changes and migrations.
