# Components

Verge Kit uses [bejamas/ui](https://ui.bejamas.com), an Astro-native component
library built around the copy-and-own approach popularized by shadcn/ui.
Components are installed as local source under `src/components/ui`, so they can
be inspected, changed, and kept specific to the application.

## Why Bejamas

- **Astro-native components.** Components are typed `.astro` files and do not
  introduce a React, Vue, or Svelte runtime.
- **Local, copy-owned source.** The component implementation lives in the
  project, making it straightforward for developers and coding agents to read,
  adapt, and debug.
- **A deterministic CLI and registry workflow.** Components can be added by
  name without manually recreating their files, dependencies, or exports.
- **shadcn registry interoperability.** Bejamas uses familiar shadcn schemas,
  design tokens, and registry conventions rather than only approximating the
  visual style.
- **Shared behavior primitives for interactive components.** Interactive
  components use `@data-slot` packages, allowing behavior and accessibility
  fixes to arrive through dependency updates while the Astro component source
  remains local.

This fits Verge Kit's server-first approach: use Astro components and semantic
HTML by default, then add client-side behavior only for interactions that need
it.

## Included Components

New Verge Kit projects include the small set of components needed by the
authentication pages and starter shell:

- [Button](https://ui.bejamas.com/components/button)
- [Field](https://ui.bejamas.com/components/field), including its label,
  description, error, group, legend, and fieldset helpers
- [Input](https://ui.bejamas.com/components/input)
- [Label](https://ui.bejamas.com/components/label)
- [Separator](https://ui.bejamas.com/components/separator)

Browse the [complete Bejamas component catalog](https://ui.bejamas.com/components)
for the components that can be added to an application.

## The Shared `cn()` Utility

Bejamas also installs `src/lib/utils.ts` as a shared registry support file. It
originates from the Bejamas/shadcn component workflow and exports `cn()`, a
small helper that combines `clsx` for conditional class names with
`tailwind-merge` for resolving conflicting Tailwind utilities.

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

The file is local, copy-owned source just like the components themselves. It is
fine to add other project-wide utility functions to it. Normal component
installs preserve an existing modified file; using the CLI's explicit
`--overwrite` option can replace registry-managed files, so review that flag's
changes before accepting them.

## Install A Component

Run the Bejamas CLI from the project root with the component's catalog name.
For example, install the dialog component with:

```bash
npx bejamas add dialog
```

The CLI reads `components.json`, writes the component files under the configured
`@/components/ui` alias, and installs any dependencies required by that
component. To inspect the planned changes without writing them first, use:

```bash
npx bejamas add dialog --dry-run
```

After installation:

1. Review the generated files and dependency changes.
2. Import the component from its local `@/components/ui/<name>` module.
3. Adapt the copied source when the application needs different behavior or
   styling.
4. Run the project verification suite.

```bash
npm run verify
```

See the [Bejamas CLI documentation](https://ui.bejamas.com/docs/cli) for
namespaced registry installs, project information, presets, and other commands.
