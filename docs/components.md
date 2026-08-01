# Components

Verge Kit uses [bejamas/ui](https://ui.bejamas.com), an Astro component library. Each installed component becomes local source in `src/components/ui`.

The components use Astro and do not add a React, Vue, or Svelte runtime. Interactive components use `@data-slot` packages for behavior and accessibility.

## Included Components

New projects include these components:

- [Button](https://ui.bejamas.com/components/button)
- [Field](https://ui.bejamas.com/components/field)
- [Input](https://ui.bejamas.com/components/input)
- [Label](https://ui.bejamas.com/components/label)
- [Separator](https://ui.bejamas.com/components/separator)

See the [Bejamas component catalog](https://ui.bejamas.com/components) for more components.

## Class Name Utility

Bejamas installs `src/lib/utils.ts`. Its `cn()` function combines conditional class names and resolves conflicting Tailwind classes.

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

You can add shared utility functions to this file. The CLI preserves changes unless you use `--overwrite`.

CAUTION: Review the proposed changes before you use `--overwrite`. This flag can replace registry-managed files.

## Install a Component

Run the Bejamas CLI from the project root:

```bash
npx bejamas add dialog
```

The CLI reads `components.json`. Then it writes the component files and installs their dependencies.

To see the proposed changes first, run:

```bash
npx bejamas add dialog --dry-run
```

After installation:

1. Review the new files and dependencies.
2. Import the component from `@/components/ui/<name>`.
3. Change the local source for your application.
4. Run all project checks.

```bash
npm run verify
```

See the [Bejamas CLI documentation](https://ui.bejamas.com/docs/cli) for more commands.
