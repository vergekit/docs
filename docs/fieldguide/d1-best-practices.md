# Responsible D1 Use

D1 cost follows rows read, rows written, and stored data. Normal traffic is usually less dangerous than an unbounded operation.

The common hazards are table scans, abusive write routes, excessive logs, and jobs without a fixed limit.

## Keep each query bounded

Apply these rules to every D1 path:

1. Select only the columns that the response needs.
2. Add a fixed result limit.
3. Use cursor pagination for lists that can grow.
4. Add indexes for common filters, joins, and sort columns.
5. When one request must run related statements together, batch them.
6. Stop imports and jobs after a fixed item count.

An index reduces scanned rows for a matching query. When indexed values change, the index adds a smaller write and storage cost.

Use `EXPLAIN QUERY PLAN` before you deploy an important query:

```bash
npx wrangler d1 execute vk --remote \
  --command='EXPLAIN QUERY PLAN SELECT id, email FROM user WHERE email = ?1'
```

Read the D1 guides for [indexes](https://developers.cloudflare.com/d1/best-practices/use-indexes/) and [query cost](https://developers.cloudflare.com/d1/platform/pricing/).

## Protect write routes

Authenticate each private write. Apply authorization before the database query.

For anonymous writes, apply these controls:

- Add [Turnstile](https://developers.cloudflare.com/turnstile/) to registration, contact, and claim forms.
- Add [rate limits](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) to authentication, search, imports, and upload-signing routes.
- Limit upload bytes, image counts, profile counts, and batch sizes.
- When a request exceeds an application limit, reject it before D1.

When a user or tenant ID is available, use it as the rate-limit key. Do not use an IP address as the only identity.

## Watch usage and cost

Review each database under **D1 > Metrics** in the Cloudflare dashboard. Watch rows read, rows written, query count, and query efficiency.

Create several [budget alerts](https://developers.cloudflare.com/billing/manage/budget-alerts/), such as $10, $25, and $50. These alerts give information only. They do not stop usage.

Set product usage notifications where Cloudflare provides them. Also set a conservative Worker `cpu_ms` limit in `wrangler.jsonc`:

```jsonc
{
  "limits": {
    "cpu_ms": 50
  }
}
```

Choose the value from measured requests. A low value can stop valid server-side rendering or authentication requests.

Log failures and unusual limits. Sample successful requests instead of recording every successful database operation.

## Add a read-only fallback

For a public content application, add a runtime flag that blocks writes during an incident. Return `503` from write routes while the flag is active.

Keep public, non-personal content in Cloudflare Cache. This cache can serve content while writes stay disabled.

Do not cache authenticated HTML or private API responses.

## Add read replicas only after measurement

Verge Kit currently passes `runtimeEnv.DB` directly to Drizzle. This path does not use D1 read replicas.

D1 read replication requires the [Sessions API](https://developers.cloudflare.com/d1/best-practices/read-replication/). Writes still use the primary database, and read consistency needs deliberate session constraints or bookmarks.

First improve cache behavior, indexes, and query bounds. Then measure real regional latency before you add replica sessions.
