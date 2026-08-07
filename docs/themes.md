# Themes & Styling

Verge Kit uses the [Bejamas theme system](https://ui.bejamas.com/docs/theming). The theme controls shared colors, fonts, radius, and other visual choices.

[Bejamas components](https://ui.bejamas.com/components) and Tailwind utilities read the same semantic CSS variables. Read [UI Components](/components) for installation and changes.

## Understand the theme files

The theme uses these files and sections:

| Location | Purpose |
| --- | --- |
| `components.json` | Stores the Bejamas style, icon library, CSS path, and import aliases |
| `src/styles/global.css` | Stores the theme variables and base styles |
| `@theme inline` | Maps CSS variables to Tailwind classes, such as `bg-primary` |
| `:root` | Stores the light theme values |
| `.dark` | Stores the dark theme values |
| `src/components/ui` | Uses the semantic theme classes |

Keep the existing CSS imports, `@custom-variant dark`, `@theme inline`, and `@layer base` sections.

## Choose a theme editor

These tools create shadcn-style theme variables:

- [Bejamas Create](https://ui.bejamas.com/create) creates a complete [Bejamas preset](https://ui.bejamas.com/docs/cli#apply). It controls styles, colors, fonts, icons, radius, and menu appearance.
- [Shadcn Themer](https://shadcnthemer.com/) creates and shares color themes for shadcn/ui.
- [tweakcn](https://tweakcn.com/editor/theme) creates themes that you can import into [Bejamas Create](https://ui.bejamas.com/create).
- [clonecn](https://github.com/hunvreus/clonecn) creates shadcn themes from screenshots, URLs, or style descriptions.

Most shadcn theme generators work with the [Bejamas color layer](https://ui.bejamas.com/docs/theming). The exported CSS must use standard variables such as `--background` and `--primary`.

These generators do not always include Bejamas component styles, icons, fonts, or menu choices. Use Bejamas Create for a complete preset.

## Create or edit a Bejamas preset

Open [Bejamas Create](https://ui.bejamas.com/create). Select the style, colors, fonts, icons, radius, and menu appearance.

The editor can import CSS from another theme tool. It can also export CSS or create a shared preset link.

To find a preset that matches the current project, run:

```bash
npx bejamas preset resolve
```

The command returns a preset code. Use the code to create a URL or open the preset editor:

```bash
npx bejamas preset url <preset>
npx bejamas preset open <preset>
```

## Apply a complete preset

First, commit your current changes. Then apply the preset code from Bejamas Create:

```bash
npx bejamas apply <preset>
```

CAUTION: Commit your changes before you apply a complete preset. The preset replaces UI components, fonts, and CSS variables.

Use a complete preset for a broad design-system change. Review all changed component files before you keep the result.

## Apply part of a preset

A partial preset keeps the installed component files.

Apply only the theme values:

```bash
npx bejamas apply <preset> --only theme
```

Apply only the font configuration:

```bash
npx bejamas apply <preset> --only font
```

Apply both parts without a component reinstall:

```bash
npx bejamas apply <preset> --only theme,font
```

## Import a shadcn theme

Copy the exported CSS from the theme generator. Then use one of these methods:

1. Import the CSS into [Bejamas Create](https://ui.bejamas.com/create).
2. Copy the variable values into `src/styles/global.css`.

Replace values inside `:root` and `.dark`. Keep the existing variable names and `@theme inline` mappings.

Some generators include variables that Verge Kit does not use. You can keep them, or remove them after you review the component needs.

## Know the main tokens

Use semantic tokens for shared interface colors:

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
| Charts | `--chart-1` through `--chart-5` |
| Shape | `--radius` |

Each foreground token must remain readable on its matching background token.

The project uses OKLCH values by default. You can use another valid CSS color format if the complete theme uses it consistently.

Read the [Bejamas theming guide](https://ui.bejamas.com/docs/theming) for more information.

## Add an application token

Add a semantic token when the same meaning appears in many places. Define light and dark values:

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

Then add the Tailwind mappings inside the existing `@theme inline` section:

```css
@theme inline {
  --color-status-success: var(--status-success);
  --color-status-success-foreground: var(--status-success-foreground);
}
```

You can now use the token with Tailwind classes:

```html
<div class="bg-status-success text-status-success-foreground">
  Saved successfully
</div>
```

Do not add a shared token for one isolated color. Use a local Tailwind color utility for that case.

## Complete the theme

Run all project checks:

```bash
npm run verify
```

Then inspect these states in the light and dark themes:

- Body text and links
- Primary and secondary buttons
- Inputs, focus rings, and disabled controls
- Cards, popovers, and borders
- Error messages and destructive actions
- Charts and status colors

Make sure that focus, hover, error, and disabled states remain distinct.
