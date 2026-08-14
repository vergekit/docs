# Design System

Verge Kit uses [bejamas/ui](https://ui.bejamas.com), an Astro-native design system for components and themes. Installed components become local source in `src/components/ui`.

The components do not add a browser framework. Interactive components use `@data-slot` packages for behavior and accessibility.

Bejamas/ui components and [Tailwind](https://tailwindcss.com/) utilities read the same semantic CSS variables. The theme controls shared colors, fonts, radius, and other visual choices.

## Components

### Find a component

Browse the [Bejamas/ui component catalog](https://ui.bejamas.com/components) for previews, examples, and component APIs.

New Verge Kit projects include these components:

- [Button](https://ui.bejamas.com/components/button)
- [Field](https://ui.bejamas.com/components/field)
- [Input](https://ui.bejamas.com/components/input)
- [Label](https://ui.bejamas.com/components/label)
- [Separator](https://ui.bejamas.com/components/separator)

### Understand the component files

Each component family has one folder. The folder contains its Astro files and an `index.ts` export file.

For example, the button files are in `src/components/ui/button`. Import the component from that folder:

```astro
---
import { Button } from "@/components/ui/button";
---

<Button>Save</Button>
```

`components.json` tells the CLI where these files belong. It also stores the component style, icon library, CSS path, and import aliases.

### Install a component

Run the Bejamas CLI from the project root:

```bash
npx bejamas add dialog
```

The CLI reads `components.json`, then writes the component files and installs their dependencies.

After installation, import the component from `@/components/ui/<name>`.

Read the [Bejamas CLI documentation](https://ui.bejamas.com/docs/cli) for all commands and options.

### Change a component

The installed files belong to your application. You can change their markup, variants, classes, and props.

Keep common UI primitives in `src/components/ui`. Put application-specific components outside that folder.

For example, keep `Button` in `src/components/ui/button`. Put a `DeleteAccountButton` in `src/components/account`.

Use semantic theme classes for shared colors:

```astro
<div class="bg-card text-card-foreground border-border">
  ...
</div>
```

### Class name utility

Bejamas always installs `src/lib/utils.ts`. Its `cn()` function combines conditional classes and resolves conflicting Tailwind classes.

## Themes and styling

Read the [Bejamas/ui theming guide](https://ui.bejamas.com/docs/theming) for the complete theme reference.

### Theme files

| Location | Purpose |
| --- | --- |
| `components.json` | Stores the Bejamas style, icon library, CSS path, and import aliases |
| `src/styles/global.css` | Stores the theme variables and base styles |
| `@theme inline` | Maps CSS variables to Tailwind classes, such as `bg-primary` |
| `:root` | Stores the light theme values |
| `.dark` | Stores the dark theme values |
| `src/components/ui` | Uses the semantic theme classes |

### Theme editors

<table aria-label="Theme editors">
  <tbody>
    <tr>
      <td><a class="whitespace-nowrap" href="https://ui.bejamas.com/create">Bejamas Create</a></td>
      <td>Creates complete <a href="https://ui.bejamas.com/docs/cli#apply">Bejamas presets</a> with components and theme settings</td>
    </tr>
    <tr>
      <td><a class="whitespace-nowrap" href="https://shadcnthemer.com/">Shadcn Themer</a></td>
      <td>Creates and shares color themes for shadcn/ui</td>
    </tr>
    <tr>
      <td><a class="whitespace-nowrap" href="https://tweakcn.com/editor/theme">tweakcn</a></td>
      <td>Creates themes that you can import into <a href="https://ui.bejamas.com/create">Bejamas Create</a></td>
    </tr>
    <tr>
      <td><a class="whitespace-nowrap" href="https://github.com/hunvreus/clonecn">clonecn</a></td>
      <td>Creates shadcn themes from screenshots, URLs, or style descriptions</td>
    </tr>
  </tbody>
</table>

Most shadcn theme generators work with the [Bejamas color layer](https://ui.bejamas.com/docs/theming). The exported CSS must use standard variables such as `--background` and `--primary`.

These generators do not always include Bejamas component styles, icons, fonts, or menu choices. Use [Bejamas Create](https://ui.bejamas.com/create) for a complete preset.

### Create or edit a Bejamas preset

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

### Apply a complete preset

First, commit your current changes. Then apply the preset code from Bejamas Create:

```bash
npx bejamas apply <preset>
```

CAUTION: Commit your changes before you apply a complete preset. The preset replaces UI components, fonts, and CSS variables.

Use a complete preset for a broad design-system change. Review all changed component files before you keep the result.

### Apply part of a preset

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

### Import a shadcn theme

Copy the exported CSS from the theme generator. Then use one of these methods:

1. Import the CSS into [Bejamas Create](https://ui.bejamas.com/create).
2. Copy the variable values into `src/styles/global.css`.

Replace values inside `:root` and `.dark`. Keep the existing variable names and `@theme inline` mappings.

Some generators include variables that Verge Kit does not use. You can keep them or remove them after you review the component needs.

### Know the main tokens

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

The project uses OKLCH values by default. If the complete theme uses another valid CSS color format, use that format consistently.

### Add an application token

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

### Complete the theme

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
