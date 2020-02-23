<div align="center">

# docsify-select

[![Release](https://img.shields.io/github/release/jthegedus/docsify-select.svg)](https://github.com/jthegedus/docsify-select/releases) [![NPM](https://img.shields.io/npm/v/docsify-select.svg)](https://www.npmjs.com/package/docsify-select) ![Unit Tests](https://github.com/jthegedus/docsify-select/workflows/Unit%20Tests/badge.svg)

A [docsify.js](https://docsify.js.org) plugin for variably rendering content with HTML select menus defined in markdown.

</div>

## Features

- Single select menus
- Complex multi-select menus with partial selections and default content

## Demo

### Single Select

something

<!-- select:start -->
<!-- select-menu-labels: testing menu labels in comments -->

Common content can go here above the first heading in a section and be rendered for all selections!

### **macOS**

macOS instructions here

<!-- tabs:start -->

#### **Git**

Git instructions

#### **Homebrew**

Homebrew instructions

<!-- tabs:end -->

### **Linux**

Linux instructions here

<!-- select:end -->

---

### Two Selects

<!-- select:start -->
<!-- select-menu-labels: Operating System,Shell -->

Common content can go here above the first heading in a section and be rendered for all selections!

### **macOS,Bash**

macOS + Bash

### **macOS,Fish**

macOS + Fish

### **macOS,ZSH**

macOS + ZSH

### **Linux,Bash**

Linux + Bash

### **Linux,Fish**

Linux + Fish

### **Linux,ZSH**

Linux + ZSH

<!-- select:end -->

---

### Three (or more) Selects with partial selections

<!-- select:start -->
<!-- select-menu-labels: Operating System,Shell,Installation Method -->

Common content can go here above the first heading in a section and be rendered for all selections!

### **macOS,Bash,Homebrew or Something**

macOS + Bash + Homebrew

### **macOS,Fish,Homebrew or Something**

macOS + Fish + Homebrew

### **macOS,ZSH,Homebrew or Something**

macOS + ZSH + Homebrew

### **macOS,Bash,Git**

macOS + Bash + Git

### **macOS,Fish,Git**

macOS + Fish + Git

### **macOS,ZSH,Git**

macOS + ZSH + Git

### **Linux,Bash,Git**

Linux + Bash + Git

### **Linux,Fish,Git**

Linux + Fish + Git

### **Linux,ZSH,Git**

Linux + ZSH + Git

### **Docsify Select Default**

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
window.$docsify = {
	// ...
	select: {
		theme: 'classic'
	}
};
```

## Usage

### Single Select List

```markdown

<!-- select:start -->
<!-- select-menu-labels: Operating System -->

#### ** macOS **

macOS

### ** Linux **

Linux

<!-- select:end -->

```

### Multiple Select Lists!

You can define multiple select lists and render content based on the combined result of the selections.

This example has 2 select lists:

```markdown

<!-- select:start -->
<!-- select-menu-labels: Operating System,Shell -->

#### ** macOS + Bash **

macOS + Bash

#### ** macOS + ZSH **

macOS + ZSH

#### ** Linux + Bash **

Linux + Bash

#### ** Linux + ZSH **

Linux + ZSH

<!-- select:end -->
```

```markdown
select 1:
	- macOS
	- Linux

select 2:
	- Bash
	- ZSH
```

## Options

Options are set within the [`window.$docsify`](https://docsify.js.org/#/configuration) configuration under the `select` key.

### Theme

* Type: `string|boolean`
* Accepts: `'classic'`, `'material'`, `false`
* Default: `'classic'`

Sets the tab theme. A value of `false` will indicate that no theme should be applied. Use `false when creating custom select themes.

**Configuration**

```javascript
window.$docsify = {
  // ...
  select: {
    theme: 'classic' // default
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

## Themes

<!-- explain your plugins theme customisations here -->

## Visual Tests

With `select` plugin imported above `tabs` in `index.html`:

```html
    <script src="https://cdn.jsdelivr.net/npm/docsify-select@1"></script>
    <script src="https://cdn.jsdelivr.net/npm/docsify-tabs@1"></script>
```

And the use of `tabs` [tabHeadings](https://jhildenbiddle.github.io/docsify-tabs/#/?id=tabheadings) we see the following visual clashes.

!> It is advised to use the [tabComments settings](https://jhildenbiddle.github.io/docsify-tabs/#/?id=tabcomments) of `docsify-tabs` as it removes this class of issues.

### Select in Tabs (does not work!)

<!-- tabs:start -->

#### **Tab 1**

Tab 1 content

<!-- select:start -->
<!-- select-menu-labels: testing menu labels in comments -->

Common content can go here above the first heading in a section and be rendered for all selections!

#### **Select 1**

Select 1 content

#### **select 2**

select 2 content

<!-- select:end -->

#### **Tab 2**

tab 2 content

<!-- tabs:end -->

---

### Tabs in Select (works!)

<!-- select:start -->
<!-- select-menu-labels: testing tabs in selections -->

Common content can go here above the first heading in a section and be rendered for all selections!

#### **Tabs in here**

Content in selection not in the tab

<!-- tabs:start -->

#### **tab 1**

Tab 1 content

#### **tab 2**

Tab 2 content

<!-- tabs:end -->

#### **Regular content**

Regular content here

<!-- select:end -->

---

## Roadmap and Improvements

- [x] single select menu
- [x] multi-select menu
- [x] multi-select menu with partial selections & default values
- [x] render initial selection
- [x] ensure compatibility with [docsify-tabs](https://github.com/jhildenbiddle/docsify-tabs).
	- can be used together with intention. Ideally, both would support comment definitions of headings too.
- [ ] tab themes
  - [ ] no theme
  - [ ] classic
- [ ] live theme example
- [ ] release a v0.1
- [ ] parity with docsify-tabs themes
  - [ ] material design
- [ ] bugfixes
- [ ] automatically detect operating system and make selection of OS for all selects with label/id "operating-system"
- [ ] tests (unit & e2e)
- [ ] release a v1
- [ ] custom theme for `docsify-select` docs site
- [ ] selectComment definitions to allow more freedom other plugins (`docsify-tabs`)
- [ ] favicon

## Support

Create a [GitHub issue](https://github.com/jthegedus/docsify-<your-plugin>/issues) for bug reports, feature requests, or questions

## License

[MIT License](https://github.com/jthegedus/docsify-<your-plugin>/blob/master/license)
