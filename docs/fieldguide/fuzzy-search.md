# Fuzzy Search

Use this recipe for a small data set. D1 returns a bounded candidate list, and Fuse.js ranks matches inside the Worker.

This approach accepts spelling errors without a new search service. It does not fit a large table or a high-traffic search endpoint.

## 1. Install Fuse.js

```bash
npm install fuse.js
```

## 2. Add the search function

Create `src/lib/search-projects.ts`. Replace `project` and its fields with your application table and fields.

```ts
import { desc } from 'drizzle-orm';
import Fuse from 'fuse.js';
import { project } from '@/config/schema';
import { db } from '@/db';

const MAX_CANDIDATES = 500;
const MAX_RESULTS = 20;

export async function searchProjects(rawQuery: string) {
  const query = rawQuery.trim().slice(0, 100);

  if (query.length < 2) {
    return [];
  }

  const candidates = await db
    .select({
      id: project.id,
      title: project.title,
      summary: project.summary,
    })
    .from(project)
    .orderBy(desc(project.updatedAt))
    .limit(MAX_CANDIDATES);

  const index = new Fuse(candidates, {
    keys: [
      { name: 'title', weight: 0.7 },
      { name: 'summary', weight: 0.3 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
  });

  return index
    .search(query, { limit: MAX_RESULTS })
    .map((result) => result.item);
}
```

`threshold` controls the allowed difference. A smaller value requires a closer match.

## 3. Use the function from a route

Create `src/pages/api/search.ts`:

```ts
import type { APIRoute } from 'astro';
import { searchProjects } from '@/lib/search-projects';

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q') ?? '';
  const results = await searchProjects(query);

  return Response.json({ results });
};
```

Protect private results before this route returns them. Add a rate limit before the database query for a public endpoint.

For live search, wait at least 250 ms after the last input before you send a request.

## 4. Know the limit

This query reads at most 500 rows for each search. When rows are large or searches are frequent, lower `MAX_CANDIDATES`.

When the table no longer fits this limit, use [D1 FTS5](https://developers.cloudflare.com/d1/sql-api/sql-statements/#supported-sqlite-extensions). FTS5 can reduce the candidate set before Fuse.js ranks it.

When you need large indexes, language analysis, facets, or complex ranking, use a dedicated search service.

Run all project checks:

```bash
npm run verify
```
