# Theme Development

Verge Kit keeps its theme in `src/styles/global.css`. Bejamas components and Tailwind utilities read the same CSS variables.

## Use the theme editor

1. Open the [bejamas theme editor](https://ui.bejamas.com/create).
2. Set the light colors.
3. Set the dark colors.
4. Export the theme as CSS.
5. Copy the variable values into `src/styles/global.css`.

Replace values inside `:root` and `.dark`. Keep the variable names and the existing `@theme inline` block.

The editor can also import themes from [tweakcn](https://tweakcn.com/editor/theme). Most shadcn themes use compatible token names.

## Know the main tokens

Start with these token groups:

| Purpose | Tokens |
| --- | --- |
| Page | `--background`, `--foreground` |
| Main action | `--primary`, `--primary-foreground` |
| Secondary action | `--secondary`, `--secondary-foreground` |
| Quiet content | `--muted`, `--muted-foreground` |
| Hover and selection | `--accent`, `--accent-foreground` |
| Panels | `--card`, `--card-foreground`, `--popover`, `--popover-foreground` |
| Controls | `--border`, `--input`, `--ring` |
| Errors | `--destructive`, `--destructive-foreground` |
| Shape | `--radius` |

The foreground token in each pair must stay readable on its matching background token.

Chart tokens are optional until the application uses charts. Keep undefined tokens out of components that depend on them.

Read the [bejamas theming guide](https://ui.bejamas.com/docs/theming) for the complete token set.

## Add application tokens for shared needs

Use a semantic name for each new application token:

```css
:root {
  --status-success: oklch(0.62 0.17 145);
  --status-success-foreground: oklch(0.98 0.02 145);
}

.dark {
  --status-success: oklch(0.72 0.16 145);
  --status-success-foreground: oklch(0.18 0.03 145);
}
```

Do not add a token for one isolated color. Use a local Tailwind utility for that case.

## Complete the theme

Run all project checks:

```bash
npm run verify
```

Then inspect these states in light and dark themes:

- Body text and links
- Primary and secondary buttons
- Inputs, focus rings, and disabled controls
- Cards, popovers, and borders
- Error messages and destructive actions

Make sure that focus, hover, error, and disabled states remain distinct.
