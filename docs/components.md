# UI Components

Verge Kit uses [bejamas/ui](https://ui.bejamas.com), an Astro component library. Installed components become local source in `src/components/ui`.

The components do not add a browser framework. Interactive components use `@data-slot` packages for behavior and accessibility.

Read [Themes & Styling](/themes) to change colors, fonts, radius, and other shared styles.

## Find a component

Use these sources:

- Browse the [Bejamas component catalog](https://ui.bejamas.com/components) for previews, examples, and component APIs.
- Read the installed source in `src/components/ui`.
- Run `npx bejamas docs <name>` to find documentation from the command line.
- Run `npx bejamas info` to see the current component configuration.

New Verge Kit projects include these components:

- [Button](https://ui.bejamas.com/components/button)
- [Field](https://ui.bejamas.com/components/field)
- [Input](https://ui.bejamas.com/components/input)
- [Label](https://ui.bejamas.com/components/label)
- [Separator](https://ui.bejamas.com/components/separator)

## Understand the component files

Each component family has one folder. The folder contains its Astro files and an `index.ts` export file.

For example, the button files are in `src/components/ui/button`. Import the component from that folder:

```astro
---
import { Button } from "@/components/ui/button";
---

<Button>Save</Button>
```

`components.json` tells the CLI where these files belong. It also stores the component style, icon library, CSS path, and import aliases.

## Install a component

Run the Bejamas CLI from the project root:

```bash
npx bejamas add dialog
```

The CLI reads `components.json`, then writes the component files and installs their dependencies.

After installation, import the component from `@/components/ui/<name>`.

Read the [Bejamas CLI documentation](https://ui.bejamas.com/docs/cli) for all commands and options.

## Change a component

The installed files belong to your application. You can change their markup, variants, classes, and props.

Keep common UI primitives in `src/components/ui`. Put application-specific components outside that folder.

For example, keep `Button` in `src/components/ui/button`. Put a `DeleteAccountButton` in `src/components/account`.

Use semantic theme classes for shared colors:

```astro
<div class="bg-card text-card-foreground border-border">
  ...
</div>
```

Use [Themes & Styling](/themes) for a visual change that must affect many components.


## Class name utility

Bejamas always installs `src/lib/utils.ts`. Its `cn()` function combines conditional classes and resolves conflicting Tailwind classes.