# Astro Actions

Astro Actions are typed server functions. Use an action for a form that validates input and changes server state.

The Verge Kit starter includes an empty action registry at `src/actions/index.ts`.

## 1. Define the action

Replace the empty registry with one action:

```ts
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  saveTheme: defineAction({
    accept: 'form',
    input: z.object({
      theme: z.enum(['light', 'dark']),
    }),
    handler: async ({ theme }, context) => {
      context.cookies.set('theme', theme, {
        path: '/',
        sameSite: 'lax',
        secure: import.meta.env.PROD,
      });

      return { message: 'Theme saved.' };
    },
  }),
};
```

The input schema validates the form before the handler runs. The handler stores the preference and returns a small result.

## 2. Use the action in a form

Add the action to an Astro page:

```astro
---
import { actions } from 'astro:actions';

const result = Astro.getActionResult(actions.saveTheme);
---

{result?.data && <p role="status">{result.data.message}</p>}
{result?.error && <p role="alert">The theme was not saved.</p>}

<form method="POST" action={actions.saveTheme}>
  <label for="theme">Theme</label>
  <select id="theme" name="theme" required>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
  <button type="submit">Save theme</button>
</form>
```

The form works without client JavaScript. Astro returns validation errors in `result.error` and successful data in `result.data`.

Astro exposes every action as a public endpoint. For a private action, authorize the user in the handler before you change data.

## Related guides

- [Astro Actions guide](https://docs.astro.build/en/guides/actions/) - Official guide for the complete Astro Actions workflow
- [bejamas/ui forms with Astro Actions](https://ui.bejamas.com/docs/forms-astro-actions) - Building validated forms for Astro Actions with  bejamas/ui field primitives