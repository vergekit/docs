# CSS Layout Snippets

Useful CSS patterns you can use alongside or instead of Tailwind.

## Vertical Center

Center content on a blank page:

```css
body {
  display: grid;
  place-items: center;
}
```

## Sticky Pancake Stack

Sticky header and footer with flexible main content:

```html
<style>
  body {
    display: grid;
    grid-template-rows: auto 1fr auto;
  }
</style>

<header></header>
<main></main>
<footer></footer>
```

## Holy Grail Layout

Classic layout with sticky header, footer, and sidebars:

```html
<style>
  body {
    display: grid;
    grid-template: auto 1fr auto / auto 1fr auto;
  }

  header {
    padding: 2rem;
    grid-column: 1 / 4;
  }

  .left-sidebar {
    grid-column: 1 / 2;
  }

  main {
    grid-column: 2 / 3;
  }

  .right-sidebar {
    grid-column: 3 / 4;
  }

  footer {
    grid-column: 1 / 4;
  }
</style>

<header></header>
<aside class="left-sidebar"></aside>
<main></main>
<aside class="right-sidebar"></aside>
<footer></footer>
```
