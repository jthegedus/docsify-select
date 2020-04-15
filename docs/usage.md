# Usage

Many different usages of `docsify-select`

## Single Selection

A single select menu with multiple options and shared content between the select menus and selected content.

<!-- tabs:start -->

### **Rendered**

<!-- select:start -->
<!-- select-menu-labels: Operating System -->

Common content can go here above the first heading in a section and be rendered for all selections!

#### --macOS--

macOS instructions here

#### --Linux--

Linux instructions here

<!-- select:end -->

### **Markdown**

```markdown
<!-- select:start -->
<!-- select-menu-labels: Operating System -->

Common content can go here above the first heading in a section and be rendered for all selections!

#### --macOS--

macOS instructions here

#### --Linux--

Linux instructions here

<!-- select:end -->
```

<!-- tabs:end -->

## Multiple Selections

Multiple menus can be combined to perform complex selections of content. Take care using this approach as you end up with a large number of combinations quickly.

<!-- tabs:start -->

### **Rendered**

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

### **Markdown**

```markdown
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
```

<!-- tabs:end -->

## Partial Selections

Multiple selections can result in a large combination of menu options. A default can be shown when no content is found to match the selection.

For example, there is no combination of options below for `Linux` and `Homebrew` and so the `--Docsify Select Default--` content is shown.

<!-- tabs:start -->

### **Rendered**

<!-- select:start -->
<!-- select-menu-labels: Operating System,Shell,Installation Method -->

Common content can go here above the first heading in a section and be rendered for all selections!

### --macOS,Bash,Homebrew--

macOS + Bash + Homebrew

### --macOS,Fish,Homebrew--

macOS + Fish + Homebrew

### --macOS,ZSH,Homebrew--

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

Some default content here. Since each Linux selection does not have "Homebrew" as one of their options, the default content is rendered instead.

It is encouraged to have specific content for each heading to not confuse users.

<!-- select:end -->

### **Markdown**

```markdown
<!-- select:start -->
<!-- select-menu-labels: Operating System,Shell,Installation Method -->

Common content can go here above the first heading in a section and be rendered for all selections!

### --macOS,Bash,Homebrew--

macOS + Bash + Homebrew

### --macOS,Fish,Homebrew--

macOS + Fish + Homebrew

### --macOS,ZSH,Homebrew--

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

Some default content here. Since each Linux selection does not have "Homebrew" as one of their options, the default content is rendered instead.

It is encouraged to have specific content for each heading to not confuse users.

<!-- select:end -->
```

<!-- tabs:end -->

## Docsify Embed Files

With a large number of selections the inline content can become difficult to reason about. [Dosify Embed files](https://docsify.js.org/#/embed-files) is a useful feature to help manage the content elsewhere.

I would recommend a "section file" for each "selection" in this file structure:

```
docs/
    sections/
        partial-completion/
            docsify-default.md
            linux-bash-git.md
            linux-fish-git.md
            linux-zsh-git.md
            ...
    index.md
    sidebar.md
    usage.md
```

!> `docsify-select` & `docsify-tabs` are NOT computed properly if inline in a Docsify Embed file. Tabs and Select usage must occur at the root of a Docsify page.

<!-- tabs:start -->

### **Rendered**

<!-- select:start -->
<!-- select-menu-labels: Docsify Embed Files -->

### --Regular Content--

This is some regular content contained in a `docsify-select` selection.

### --Embed Files Content--

[Embed Files Test](sections/test-includes.md ":include")

<!-- select:end -->

### **Markdown**

```markdown
<!-- select:start -->
<!-- select-menu-labels: Docsify Embed Files -->

### --Regular Content--

This is some regular content contained in a `docsify-select` selection.

### --Embed Files Content--

[Embed Files Test](sections/test-includes.md ":include")

<!-- select:end -->
```

<!-- tabs:end -->

## Compatibility Tests

`docsify-tabs` uses `**` or `__` to identify headings to convert to tabs. Since these identifiers are different to the `--` or `~~` used by `docsify-select` the two are compatible without any specific changes.

### Tabs in Select

`docsify-tabs` works as expected when embedded into a `docsify-select` selection.

<!-- select:start -->
<!-- select-menu-labels: Tabs in select -->

#### --rendered--

<!-- tabs:start -->

#### **tab 1**

Tab 1 content

#### **tab 2**

Tab 2 content

<!-- tabs:end -->

#### --markdown--

```markdown
<!-- tabs:start -->

#### **tab 1**

Tab 1 content

#### **tab 2**

Tab 2 content

<!-- tabs:end -->
```

<!-- select:end -->

### Select in Tabs

This whole page demonstrates that `docsify-select` can function when within `docsify-tabs`. The code from the [Single Selection](#single-selection) section.

```markdown
<!-- tabs:start -->

### **Rendered**

<!-- select:start -->
<!-- select-menu-labels: Operating System -->

Common content can go here above the first heading in a section and be rendered for all selections!

#### --macOS--

macOS instructions here

#### --Linux--

Linux instructions here

<!-- select:end -->

### **Markdown**

<code class="lang-markdown language-markdown">
<!-- select:start -->
<!-- select-menu-labels: Operating System -->

Common content can go here above the first heading in a section and be rendered for all selections!

#### --macOS--

macOS instructions here

#### --Linux--

Linux instructions here

<!-- select:end -->
</code>

<!-- tabs:end -->
```
