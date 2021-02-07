# Configuration

Options are set within the [`window.$docsify`](https://docsify.js.org/#/configuration) configuration under the `select` key.

## detect operating system

- Type: `object`
- Accepts: `{ enabled: true|false, elementId: string }`
- Default: `{ enabled: false, menuId: "operating-system" }`

Detects the machine's Operating System and sets any select menus with label `<!-- select-menu-labels: Operating System -->` to the `value` matching the Operating System.

This works as the `select` menu has it's `id` set to be equal to the trimmed, lowercase, hyphenated version of the label. IE: `<!-- select-menu-labels: Operating System -->` produces a HTML select element with `<select id="operating-system">`. This `id` is used to target the page's select menus.

If an option `value` matches then it will be set automatically.

**Configuration**

```javascript
window.$docsify = {
  // ...
  select: {
    detectOperatingSystem: {
      //defaults
      enabled: false,
      menuId: "operating-system",
    },
  },
};
```

<!-- tabs:start -->

#### **Single Select Demo**

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

#### **Markdown**

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

<!-- tabs:end -->
<!-- tabs:start -->

#### **Multiple Select Demo**

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

#### **Markdown**

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

<!-- tabs:end -->

## sync

- Type: `boolean`
- Accepts: `true|false`
- Default: `false`

If multiple select menus share the same label `<!-- select-menu-labels: Some Label Name -->` and contain the same option `## --Some Option--`, then the menu selections will be synced across select groups.

The syncing occurs for all menus and options across the whole page. Combined with the `detect operating system` configuration, a great documentation user experience can be created.

**Configuration**

```javascript
window.$docsify = {
  // ...
  select: {
    sync: false, // default
  },
};
```

<!-- tabs:start -->

#### **Demo**

This example shows two select menus with the same `Operating System` label and the same 3 options. See how they're synced.

<!-- select:start -->
<!-- select-menu-labels:Operating System -->

#### --macOS--

macOS instructions here

#### --Linux--

Linux instructions here

#### --Windows--

Windows instructions here

<!-- select:end -->

---

<!-- select:start -->
<!-- select-menu-labels:Operating System -->

#### --macOS--

macOS instructions here

#### --Linux--

Linux instructions here

#### --Windows--

Windows instructions here

<!-- select:end -->

#### **Markdown**

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

---

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

<!-- tabs:end -->

## use select heading comment

- Type: `boolean`
- Accepts: `true|false`
- Default: `false`


Changes the syntax for the select options from `--` or  `~~` to appending the an HTML comment (`<!-- select-option -->`) to the heading. For example:

```markdown
<!-- select:start -->
<!-- select-menu-labels:Operating System -->

#### macOS <!-- select-option -->

macOS instructions here

#### Linux <!-- select-option -->

Linux instructions here

#### Windows <!-- select-option -->

Windows instructions here

<!-- select:end -->
```

**Configuration**

```javascript
window.$docsify = {
  // ...
  select: {
    useSelectHeadingComment: false, // default
  },
};
```

## theme

- Type: `string`
- Accepts: `'classic'|'none'`
- Default: `'classic'`

Sets the select menu theme. A value of `'none'` will indicate that no theme should be applied. Use `'none'` when creating custom select themes.

**Configuration**

```javascript
window.$docsify = {
  // ...
  select: {
    theme: "classic", // default
  },
};
```

<!-- tabs:start -->

#### **Demo**

<label data-class-target="label + .docsify-select" data-class-add="docsify-select--classic">
  <input name="theme" type="radio" value="classic" checked="checked"> <code>classic</code>
</label>
<label data-class-target="label + .docsify-select" data-class-remove="docsify-select--classic">
  <input name="theme" type="radio" value="none"> <code>none</code>
</label>

<!-- select:start -->
<!-- select-menu-labels: Shell,Operating System -->

The Operating System select can be in any position of a multi-select group.

### --Bash with a really long entry to show that the text doesn't overflow the chevron,macOS--

Bash + macOS

### --Fish,macOS--

Fish + macOS

### --ZSH,macOS--

ZSH + macOS

### --Bash with a really long entry to show that the text doesn't overflow the chevron,Linux--

Bash + Linux

### --Fish,Linux--

Fish + Linux

### --ZSH,Linux--

ZSH + Linux

<!-- select:end -->

<!-- tabs:end -->

## Theme Properties

Theme properties allow you to customize tab styles without writing complex CSS. The following list contains the default theme values:

[vars.css](https://raw.githubusercontent.com/jthegedus/docsify-select/main/src/vars.css ":include :type:code")

To set theme properties, add a `<style>` element to your `index.html` file after all other stylesheets and set properties within a `:root` selector.

```html
<style>
  :root {
    --docsifyselect-menu-background: #ededed;
    --docsifyselect-menu-border-color: purple;
  }
</style>
```

The css classes apply to the following HTML structure of the parsed markdown:

```
content
|
+ select                    (select block)
  |
  + select-group            (select menu group)
  | |
  | + select-menu-container (1 or more)
  |   |
  |   + select-menu         (select menu)
  |     |
  |     + select__option    (select option)
  |
  + select__content         (content. 1 or more)
  + select__content--active (active content. exactly 1)
```
