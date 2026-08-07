# Layout Patterns

Common page layouts built with Tailwind utility classes.

## Vertical Center

Center content on a blank page:

```html
<body class="grid min-h-dvh place-items-center">
  <!-- Content -->
</body>
```

## Sticky Pancake Stack

Sticky header and footer with flexible main content:

```html
<body class="grid min-h-dvh grid-rows-[auto_1fr_auto]">
  <header></header>
  <main></main>
  <footer></footer>
</body>
```

## Holy Grail Layout

Classic layout with sticky header, footer, and sidebars:

```html
<body
  class="grid min-h-dvh grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[auto_1fr_auto]"
>
  <header class="col-span-full p-8"></header>
  <aside class="col-start-1 row-start-2"></aside>
  <main class="col-start-2 row-start-2"></main>
  <aside class="col-start-3 row-start-2"></aside>
  <footer class="col-span-full row-start-3"></footer>
</body>
```
