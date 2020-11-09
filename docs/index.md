<div align="center">

# docsify-select

[![Release](https://img.shields.io/github/release/jthegedus/docsify-select.svg)](https://github.com/jthegedus/docsify-select/releases) [![NPM](https://img.shields.io/npm/v/docsify-select.svg)](https://www.npmjs.com/package/docsify-select) ![Lint and Unit Tests](https://github.com/jthegedus/docsify-select/workflows/Lint%20and%20Unit%20Tests/badge.svg)

A [docsify.js](https://docsify.js.org) plugin for variably rendering content with HTML select menus defined in markdown.

</div>

## Features

- Single select menus
- Multi select menus
- Complex multi-select menus with partial selections and default content
- Sync selection across menus with same id
- Automatically detect operating system and select options for menus with specific labels
- Compatible with [`docsify-tabs`](https://github.com/jhildenbiddle/docsify-tabs)

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

### Multiple Select

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

## Support

- Create a [GitHub issue](https://github.com/jthegedus/docsify-select/issues) for bug reports, feature requests, or questions
- Add a ⭐️ [star on GitHub](https://github.com/jthegedus/docsify-select) or [![Twitter](https://icongr.am/simple/twitter.svg?colored&size=14) tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjthegedus%2Fdocsify-select&hashtags=css,developers,frontend,javascript) to support the project!

## License

[MIT License](https://github.com/jthegedus/docsify-select/blob/main/license)
