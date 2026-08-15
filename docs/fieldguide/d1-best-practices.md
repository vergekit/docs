# D1 Best Practices

D1 usage is based on rows read, rows written, and stored data. Bound each operation before traffic grows.

## Bound every query

Apply these rules to each D1 query:

1. Select only the columns that the response needs.
2. Limit the number of returned rows.
3. Use cursor pagination for lists that can grow.
4. Index columns used often in filters, joins, and sorting.
5. Batch related statements to reduce network round trips.
6. Process imports and background jobs in fixed-size chunks.

A result limit bounds the response size. An index can reduce the scanned rows for a matching query.

Use `EXPLAIN QUERY PLAN` for important queries:

```bash
npx wrangler d1 execute vk --remote \
  --command='EXPLAIN QUERY PLAN SELECT id, email FROM user WHERE email = ?1'
```

Look for `SEARCH ... USING INDEX` in the output. A `SCAN` can indicate a full table scan.

Indexes add storage and write work, so add them for real query patterns. Read the D1 guides for [indexes](https://developers.cloudflare.com/d1/best-practices/use-indexes/) and [query cost](https://developers.cloudflare.com/d1/platform/pricing/).

## Protect public operations

Authenticate private writes and authorize the user before a query changes data.

For public routes:

- Add [Turnstile](https://developers.cloudflare.com/turnstile/) to registration, contact, and claim forms.
- Add [rate limits](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) to authentication, search, import, and upload routes.
- Limit upload bytes, item counts, and batch sizes.
- Reject requests that exceed a limit before they reach D1.

Use a user or tenant ID as the rate-limit key. An IP address alone is not a reliable identity.

## Measure usage

In the Cloudflare dashboard, open **D1 > Metrics** for each database. Review rows read, rows written, query count, and query efficiency.

Each D1 result also includes usage data in its `meta` object. Use this data to find expensive query paths.

Create [budget alerts](https://developers.cloudflare.com/billing/manage/budget-alerts/) at several amounts. Alerts report spend but do not stop usage.

Log failures and rejected limits. Sample successful requests instead of logging every database operation.

## Prepare for incidents

For a public content application, add a runtime flag that disables writes. Return `503` from write routes while the flag is active.

Cloudflare Cache can continue to serve public, non-personal content. Do not cache authenticated HTML or private API responses.

## Add read replicas after measurement

Verge Kit passes `runtimeEnv.DB` directly to Drizzle, so it does not use D1 read replicas.

Read replication requires the [D1 Sessions API](https://developers.cloudflare.com/d1/best-practices/read-replication/). Writes still use the primary database, and sessions control read consistency.

First improve caching, indexes, and query bounds. If measurements show high regional read latency, add replica sessions.
