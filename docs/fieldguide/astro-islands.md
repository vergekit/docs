# Astro Islands

Astro sends HTML by default. An island adds JavaScript or delayed server work to one part of the page.

When one part needs independent behavior, use an island only for that part. Keep the rest of the page as Astro and HTML.

## Add an interactive island

Verge Kit already uses React for email templates. Add the Astro React integration before you use React in a page:

```bash
npx astro add react
```

Create `src/components/Counter.tsx`:

```tsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
}
```

Use the component in an Astro page:

```astro
---
import Counter from '@/components/Counter';
---

<Counter client:visible />
```

When the button approaches the viewport, the page sends the island JavaScript.

Choose the smallest suitable client directive:

| Directive | Use it when |
| --- | --- |
| `client:load` | The control must work immediately. |
| `client:idle` | The control can wait until the browser is idle. |
| `client:visible` | The control starts below the first viewport. |
| `client:media` | The control is interactive only for a media query. |
| `client:only` | The component cannot render on the server. |

Read the Astro guide for [client islands](https://docs.astro.build/en/concepts/islands/#client-islands).

## Use plain Astro for smaller behavior

Do not add React for these cases:

- A form that posts to an Astro Action or API route
- A disclosure or dialog that a bejamas component already supports
- One event listener on one page
- Content that does not change after the server sends it

Use a normal `<script>` in the Astro component for small, local DOM behavior.

## Defer slow server content

A server island delays one Astro component. It does not add a UI framework.

Create `src/components/AccountSummary.astro`:

```astro
---
await Astro.locals.loadAuthSession();
const user = Astro.locals.user;
---

<p>{user ? `Signed in as ${user.email}` : 'Not signed in'}</p>
```

Add the component to a page:

```astro
---
import AccountSummary from '@/components/AccountSummary.astro';
---

<AccountSummary server:defer>
  <p slot="fallback">Loading account...</p>
</AccountSummary>
```

The main page arrives first. Astro then requests the server island from a separate generated route.

Use a server island for slow or personalized content that must not delay public page content. Each island adds another Worker request.

Do not split every panel into a server island. Extra requests and repeated D1 queries can make the page slower and more expensive.

Read the Astro guide for [server islands](https://docs.astro.build/en/guides/server-islands/).

Run all project checks after you add an island:

```bash
npm run verify
```
