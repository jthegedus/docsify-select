# Installation

1. Add the `docsify-select` plugin to your `index.html` after Docsify.

```html
<!-- docsify (latest v4.x.x)-->
<script src="https://cdn.jsdelivr.net/npm/docsify@4"></script>

<!-- docsify-select (latest v1.x.x) -->
<script src="https://cdn.jsdelivr.net/npm/docsify-select@1"></script>
```

2. Set your configuration options in the Docsify settings in your `index.html`. Below are the default values:

```
window.$docsify = {
  // ...
  select: {
    detectOperatingSystem: {
      enabled: false,
      menuId: "operating-system"
    },
    sync: false,
    theme: "classic"
  }
};
```

## Basics

### Select Block

A select block is started with `<!-- select:start -->` and ends with `<!-- select:end -->`

### Select Menu Labels

An HTML comment below the select block start: `<!-- select-menu-labels: MenuLabel1 -->`

!> If your page isn't loading you likely forgot a label

### Select Options

Each markdown heading (`h1` through to `h6`) you wish to be a select option, must be surrounded on each side with 2 of the following symbols: `~` or `-`.

Eg: `# --macOS--` or `# ~~macOS~~`

### Mulitple Select Menus

Menu Labels are just a comma-separated list.

Select Options must then also be a comma-separated list of the same length, where the position of the labels aligns with each option in each heading.

```markdown
<!-- select:start -->
<!-- select-menu-labels: Operating System,Shell -->

### --macOS,Git--

macOS + Git

### --macOS,Homebrew--

macOS + Homebrew

### --Linux,Git--

Linux + Git

<!-- select:end -->
```

<!-- select:start -->
<!-- select-menu-labels: Operating System,Shell -->

### --macOS,Git--

macOS + Git

### --macOS,Homebrew--

macOS + Homebrew

### --Linux,Git--

Linux + Git

<!-- select:end -->

### Partial Selections

The Multiple Select Menus example did not contain a selection of `Linux` & `Homebrew`. When this selection is made, no content is show.

Default content can be shown when no matching selection exists for the combinations of options. Use the heading `--Docsify Select Default--` to denote default content.

```markdown
<!-- select:start -->
<!-- select-menu-labels: Operating System,Shell -->

### --macOS,Git--

macOS + Git

### --macOS,Homebrew--

macOS + Homebrew

### --Linux,Git--

Linux + Git

### --Docsify Select Default--

No selection for this combination. Sorry!

<!-- select:end -->
```

<!-- select:start -->
<!-- select-menu-labels: Operating System,Shell -->

### --macOS,Git--

macOS + Git

### --macOS,Homebrew--

macOS + Homebrew

### --Linux,Git--

Linux + Git

### --Docsify Select Default--

No selection for this combination. Sorry!

<!-- select:end -->

## Complex Usage

You may have noticed the `sync` option at play on this page. See how that works over on the [configuration](configuration) page.

See the [usage](usage) page for more complex examples.
