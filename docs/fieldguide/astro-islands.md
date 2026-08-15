# Astro Islands

Astro renders components to HTML and sends no client JavaScript by default. Use an island only for the part that needs independent behavior.

- A client island adds browser interactivity.
- A server island defers slow or personalized server content.

## Add a client island

Install the [Astro React integration](https://docs.astro.build/en/guides/integrations-guide/react/):

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

Add the component to an Astro page with a client directive:

```astro
---
import Counter from '@/components/Counter';
---

<Counter client:visible />
```

`client:visible` loads the island JavaScript when the component enters the viewport.

Choose the least eager directive that gives the required experience:

| Directive | Use it when |
| --- | --- |
| `client:load` | The control must work immediately |
| `client:idle` | The control can wait until the browser is idle |
| `client:visible` | The control starts outside the first viewport |
| `client:media` | The control is interactive only for a media query |
| `client:only` | The component cannot render on the server |

For small DOM behavior, use a normal `<script>` in an Astro component. A UI framework is not necessary for one local event listener.

Read the Astro guide for [client islands](https://docs.astro.build/en/concepts/islands/#client-islands) and all [client directives](https://docs.astro.build/en/reference/directives-reference/#client-directives).

## Add a server island

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

Astro sends the main page first. It then requests the server island from a generated route.

If slow or personalized content must not delay the page, use a server island. Each island adds a Worker request.

Do not split every panel into a server island. Extra requests and repeated database queries can make the page slower and more expensive.

Read the Astro guide for [server islands](https://docs.astro.build/en/guides/server-islands/).
