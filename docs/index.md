<div align="center">

# docsify-select

[![Release](https://img.shields.io/github/release/jthegedus/docsify-select.svg)](https://github.com/jthegedus/docsify-select/releases) [![NPM](https://img.shields.io/npm/v/docsify-select.svg)](https://www.npmjs.com/package/docsify-select) ![Unit Tests](https://github.com/jthegedus/docsify-select/workflows/Unit%20Tests/badge.svg)

A [docsify.js](https://docsify.js.org) plugin for variably rendering content with HTML select menus defined in markdown.

</div>

## Features

- Single select menus
- Multi select menus
- Complex multi-select menus with partial selections and default content
- Compatible with [`docsify-tabs`](https://github.com/jhildenbiddle/docsify-tabs)
- Automatically detect operating system and select options for menus with specific labels

## Demo

### Single Select

<!-- select:start -->
<!-- select-menu-labels: Operating System -->

Common content can go here above the first heading in a section and be rendered for all selections!

#### --macOS--

macOS instructions here

#### --Linux--

Linux instructions here

<!-- select:end -->

---

### Two Selects

<!-- select:start -->
<!-- select-menu-labels: Operating System,Shell -->

Common content can go here above the first heading in a section and be rendered for all selections!

### --macOS,Bash--

macOS + Bash

### --macOS,Fish--

macOS + Fish

### --macOS,ZSH--

macOS + ZSH

### --Linux,Bash--

Linux + Bash

### --Linux,Fish--

Linux + Fish

### --Linux,ZSH--

Linux + ZSH

<!-- select:end -->

---

### Three (or more) Selects with partial selections

<!-- select:start -->
<!-- select-menu-labels: Operating System,Shell,Installation Method -->

Common content can go here above the first heading in a section and be rendered for all selections!

### --macOS,Bash,Homebrew or Something--

macOS + Bash + Homebrew

### --macOS,Fish,Homebrew or Something--

macOS + Fish + Homebrew

### --macOS,ZSH,Homebrew or Something--

macOS + ZSH + Homebrew

### --macOS,Bash,Git--

macOS + Bash + Git

### --macOS,Fish,Git--

macOS + Fish + Git

### --macOS,ZSH,Git--

macOS + ZSH + Git

### --Linux,Bash,Git--

Linux + Bash + Git

### --Linux,Fish,Git--

Linux + Fish + Git

### --Linux,ZSH,Git--

Linux + ZSH + Git

### --Docsify Select Default--

Some default content here. Since each Linux selection does not have "Homebrew or Something" as one of their options, the default content is rendered instead.

It is encouraged to have specific content for each heading to not confuse users.

<!-- select:end -->

---

## Installation

1. Add the `docsify-select` plugin to your `index.html` after Docsify.

```html
<!-- docsify (latest v4.x.x)-->
<script src="https://cdn.jsdelivr.net/npm/docsify@4"></script>

<!-- docsify-select (latest v1.x.x) -->
<script src="https://cdn.jsdelivr.net/npm/docsify-select@1"></script>
```

2. Set your configuration options in the Docsify settings in your `index.html`

```html
window.$docsify = { // ... select: { theme: 'classic' } };
```

## Usage

### Select Block

A select block is started with `<!-- select:start -->` and ends with `<!-- select:end -->`

### Select Menu Labels

An HTML comment below the select block start: `<!-- select-menu-labels: MenuLabel1 -->`

### Select Options

Each markdown heading (`h1` through to `h6`) you wish to be a select option, must be surrounded on each side with 2 of the following symbols: `~` or `-`.

Eg: `--macOS--` or `~~macOS~~`

### Single Select List

```markdown
<!-- select:start -->
<!-- select-menu-labels: Operating System -->

#### -- macOS --

macOS

### -- Linux --

Linux

<!-- select:end -->
```

<!-- select:start -->
<!-- select-menu-labels: Operating System -->

#### -- macOS --

macOS

### -- Linux --

Linux

<!-- select:end -->

### Multiple Select Lists

You can define multiple select lists and render content based on the combined result of the selections.

Menu labels a

This example has 2 select lists:

```markdown
<!-- select:start -->
<!-- select-menu-labels: Operating System,Shell -->

#### -- macOS,Bash --

macOS + Bash

#### -- macOS,ZSH --

macOS + ZSH

#### -- Linux,Bash --

Linux + Bash

#### -- Linux,ZSH --

Linux + ZSH

<!-- select:end -->
```

<!-- select:start -->
<!-- select-menu-labels: Operating System,Shell -->

#### -- macOS,Bash --

macOS + Bash

#### -- macOS,ZSH --

macOS + ZSH

#### -- Linux,Bash --

Linux + Bash

#### -- Linux,ZSH --

Linux + ZSH

<!-- select:end -->

## Options

Options are set within the [`window.$docsify`](https://docsify.js.org/#/configuration) configuration under the `select` key.

### detect operating system

- Type: `object`
- Accepts: `{ enabled: true|false, elementId: string }`
- Default: `{ enabled: false, menuId: "operating-system" }`

Detects the machine's Operating System and set any Menus with `id == operating-system` to the `value` matching the Operating System.

IE: This select block has a `menu-label` of `Operating System`, which becomes `id: operating-system`. If an option `value` matches then it will be set automatically.

**Configuration**

```javascript
window.$docsify = {
  // ...
  select: {
    detectOperatingSystem: {
      //defaults
      enabled: false,
      menuId: "operating-system"
    }
  }
};
```

**Demos**

```markdown
<!-- select:start -->
<!-- select-menu-labels: Operating System -->

The selected option should be your current operating system.

#### -- macOS --

macOS

#### -- Windows --

Windows

#### -- Linux --

Linux

<!-- select:end -->
```

<!-- select:start -->
<!-- select-menu-labels: Operating System -->

The selected option should be your current operating system.

#### -- macOS --

macOS

#### -- Windows --

Windows

#### -- Linux --

Linux

<!-- select:end -->

```markdown
<!-- select:start -->
<!-- select-menu-labels: Shell,Operating System -->

The Operating System select can be in any position of a multi-select group.

### --Bash,macOS--

Bash + macOS

### --Fish,macOS--

Fish + macOS

### --ZSH,macOS--

ZSH + macOS

### --Bash,Linux--

Bash + Linux

### --Fish,Linux--

Fish + Linux

### --ZSH,Linux--

ZSH + Linux

<!-- select:end -->
```

<!-- select:start -->
<!-- select-menu-labels: Shell,Operating System -->

The Operating System select can be in any position of a multi-select group.

### --Bash,macOS--

Bash + macOS

### --Fish,macOS--

Fish + macOS

### --ZSH,macOS--

ZSH + macOS

### --Bash,Linux--

Bash + Linux

### --Fish,Linux--

Fish + Linux

### --ZSH,Linux--

ZSH + Linux

<!-- select:end -->

### sync

- Type: `boolean`
- Accepts: `true|false`
- Default: `false`

If multiple select menus share the same label (id), and the newly selected option is in another label matching menu's options, then the menu selections will be synced across select groups.

**Configuration**

```javascript
window.$docsify = {
  // ...
  select: {
    sync: false // default
  }
};
```

**Demo**

```markdown
<!-- select:start -->
<!-- select-menu-labels:Operating System -->

#### --macOS--

macOS instructions here

#### --Linux--

Linux instructions here

#### --Windows--

Windows instructions here

<!-- select:end -->

<!-- select:start -->
<!-- select-menu-labels:Operating System -->

#### --macOS--

macOS instructions here

#### --Linux--

Linux instructions here

#### --Windows--

Windows instructions here

<!-- select:end -->
```

<!-- select:start -->
<!-- select-menu-labels:Operating System -->

#### --macOS--

macOS instructions here

#### --Linux--

Linux instructions here

#### --Windows--

Windows instructions here

<!-- select:end -->

<!-- select:start -->
<!-- select-menu-labels:Operating System -->

#### --macOS--

macOS instructions here

#### --Linux--

Linux instructions here

#### --Windows--

Windows instructions here

<!-- select:end -->

### theme

- Type: `string`
- Accepts: `'classic'|'material'|'none'`
- Default: `'classic'`

Sets the tab theme. A value of `'none'` will indicate that no theme should be applied. Use `'none'` when creating custom select themes.

**Configuration**

```javascript
window.$docsify = {
  // ...
  select: {
    theme: "classic" // default
  }
};
```

**Demo**

<label data-class-target="label + .docsify-select" data-class-remove="docsify-select--material" data-class-add="docsify-select--classic">
  <input name="theme" type="radio" value="classic" checked="checked"> Classic
</label>
<label data-class-target="label + .docsify-select" data-class-remove="docsify-select--classic" data-class-add="docsify-select--material">
  <input name="theme" type="radio" value="material"> Material
</label>
<label data-class-target="label + .docsify-select" data-class-remove="docsify-select--classic docsify-select--material">
  <input name="theme" type="radio" value="none"> No Theme
</label>

TODO: example with themes

## Theme Properties

Theme properties allow you to customize tab styles without writing complex CSS. The following list contains the default theme values.

<!-- [vars.css](https://raw.githubusercontent.com/jthegedus/docsify-select/master/src/vars.css ':include :type:cod') -->

To set theme properties, add a `<style>` element to your `index.html` file after all other stylesheets and set properties within a `:root` selector.

```html
<style>
  :root {
    --docsifyselect-border-color: #ededed;
    --docsifyselect-option-highlight-color: purple;
  }
</style>
```

## With docsify-tabs

`docsify-tabs` uses `**` or `__` to identify headings to convert to tabs. Since these identifiers are different to the `--` or `~~` used by `docsify-select` the two are compatible without any specific changes.

Here are two examples showing nesting of select in tabs and tabs in select:

### Select in Tabs

```markdown
<!-- tabs:start -->

#### **Tab 1**

Tab 1 content

<!-- select:start -->
<!-- select-menu-labels: testing menu labels in comments -->

Common content can go here above the first heading in a section and be rendered for all selections!

#### --Select 1--

Select 1 content

#### --select 2--

select 2 content

<!-- select:end -->

#### **Tab 2**

tab 2 content

<!-- tabs:end -->
```

<!-- tabs:start -->

#### **Tab 1**

Tab 1 content

<!-- select:start -->
<!-- select-menu-labels: testing menu labels in comments -->

Common content can go here above the first heading in a section and be rendered for all selections!

#### --Select 1--

Select 1 content

#### --select 2--

select 2 content

<!-- select:end -->

#### **Tab 2**

tab 2 content

<!-- tabs:end -->

---

### Tabs in Select

```markdown
<!-- select:start -->
<!-- select-menu-labels: testing tabs in selections -->

Common content can go here above the first heading in a section and be rendered for all selections!

#### --Tabs in here--

Content in selection not in the tab

<!-- tabs:start -->

#### **tab 1**

Tab 1 content

#### **tab 2**

Tab 2 content

<!-- tabs:end -->

#### --Regular content--

Regular content here

<!-- select:end -->
```

<!-- select:start -->
<!-- select-menu-labels: testing tabs in selections -->

Common content can go here above the first heading in a section and be rendered for all selections!

#### --Tabs in here--

Content in selection not in the tab

<!-- tabs:start -->

#### **tab 1**

Tab 1 content

#### **tab 2**

Tab 2 content

<!-- tabs:end -->

#### --Regular content--

Regular content here

<!-- select:end -->

---

## Roadmap and Improvements

- [x] single select menu
- [x] multi-select menu
- [x] multi-select menu with partial selections & default values
- [x] render initial selection
- [x] ensure compatibility with [docsify-tabs](https://github.com/jhildenbiddle/docsify-tabs)
- [x] automatically detect operating system and make selection of OS for all selects with label/id "operating-system"
- [x] sync selection of menus with same id
- [ ] select themes
  - [x] no theme
  - [ ] classic
  - [ ] material
- [ ] live theme example
- [ ] release a v0.1
- [ ] bugfixes
- [ ] tests (unit & e2e)
- [ ] release a v1
- [ ] custom theme for `docsify-select` docs site
- [ ] GitHub repo social preview
- [ ] selectComment definitions to allow more freedom other plugins (`docsify-tabs`)
- [ ] favicon

## Support

Create a [GitHub issue](https://github.com/jthegedus/docsify-select/issues) for bug reports, feature requests, or questions

## Contributing

See the [contribution guide](https://github.com/jthegedus/docsify-select/blob/master/contributing.md).

## License

[MIT License](https://github.com/jthegedus/docsify-select/blob/master/license)
