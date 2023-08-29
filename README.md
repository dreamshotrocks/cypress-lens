<p align="center">
  <a href="https://www.cypress-lens.io">
    <picture>
      <source media="(prefers-color-scheme: dark)"  srcset="./assets/logo-dark.png">
      <source media="(prefers-color-scheme: light)" srcset="./assets/logo-light.png">
      <img alt="Logo" src="./assets/logo-light.png">
    </picture>    
  </a>
</p>
<p align="center">
  <a href="https://on.cypress-lens.io">Documentation</a> |
  <a href="https://on.cypress-lens.io/changelog">Changelog</a> |
  <a href="https://on.cypress-lens.io/roadmap">Roadmap</a>
</p>

<h3 align="center">
  The best module for visual testing for Cypress.
</h3>

<p align="center">
  Developed in
</p>
<p align="center">
  <a href="https://bit.ly/3P7ufFf">
    <img alt="Cypress Conf Link" src="./assets/dreamshot-logo.png" width="40%" height="40%" />
  </a>
</p>
<p align="center">
  Join us, we're <a href="https://careers.dreamshot.bg/careers">hiring</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/cypress-lens">
    <img src="https://img.shields.io/npm/dm/cypress.svg" alt="npm"/>
  </a>
    <a href="https://www.npmjs.com/package/cypress-lens">
    <img src="https://img.shields.io/npm/v/cypress-lens" alt="StackShare"/>
  </a><br />
</p>

# Cypress Lens

Based on [Cypress Visual Regression](https://www.npmjs.com/package/cypress-visual-regression)

Module for visual regression testing and reporting for [Cypress](https://www.cypress.io/).

## Getting Started

Install:

```sh
$ npm install cypress-lens
```

Add the following config to your _cypress.config.js_ file:

```javascript
const { defineConfig } = require("cypress");
const getCompareSnapshotsPlugin = require("cypress-visual-regression/dist/plugin");

module.exports = defineConfig({
  screenshotsFolder: "./cypress/snapshots/actual",
  trashAssetsBeforeRuns: true,
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
    },
  },
});
```

Add the command to _cypress/support/commands.js_:

```javascript
const compareSnapshotCommand = require("cypress-visual-regression/dist/command");

compareSnapshotCommand();
```

> Make sure you import _commands.js_ in _cypress/support/e2e.js_:
>
> ```javascript
> import "./commands";
> ```

### TypeScript

If you're using TypeScript, use files with a `.ts` extension, as follows:

_cypress/cypress.config.ts_

```ts
import { defineConfig } from "cypress";
import getCompareSnapshotsPlugin from "cypress-visual-regression/dist/plugin";

export default defineConfig({
  env: {
    screenshotsFolder: "./cypress/snapshots/actual",
    trashAssetsBeforeRuns: true,
    video: false,
  },
  e2e: {
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
    },
  },
});
```

_cypress/support/commands.ts_

```ts
import compareSnapshotCommand from "cypress-visual-regression/dist/command";

compareSnapshotCommand();
```

_cypress/tsconfig.json_

```json:
{
  "compilerOptions": {
    "types": [
      "cypress",
      "cypress-visual-regression"
    ]
  }
}
```
