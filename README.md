<p align="center">
  <a href="https://careers.dreamshot.bg/open-source">
    <picture>
      <source media="(prefers-color-scheme: dark)"  srcset="./assets/logo-dark.png">
      <source media="(prefers-color-scheme: light)" srcset="./assets/logo-light.png">
      <img alt="Logo" src="./assets/logo-light.png">
    </picture>    
  </a>
</p>
<p align="center">
  <a href="https://careers.dreamshot.bg/open-source">Documentation</a> |
  <a href="https://github.com/dreamshotrocks/cypress-lens/blob/main/CHANGELOG.md">Changelog</a>
</p>

<h3 align="center">
  The best module for visual testing for Cypress.
</h3>

<p align="center">
  <a href="https://dreamshot.bg/">
    <img alt="Cypress Conf Link" src="./assets/dreamshot-logo.png" width="40%" height="40%" />
  </a>
</p>
<p align="center">
  Join us, we're <a href="https://careers.dreamshot.bg/careers">hiring</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/cypress-lens">
    <img src="https://img.shields.io/npm/v/cypress-lens" alt="version"/>
  </a>
  <a href="https://github.com/dreamshotrocks/cypress-lens/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"/>
  </a>
  <a href="https://github.com/semantic-release/semantic-release">
    <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="semantic-version"/>
  </a>
  <a href="https://conventionalcommits.org">
    <img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white" alt="conventional"/>
  </a><br />
</p>

# Cypress Lens

Based on [Cypress Visual Regression](https://www.npmjs.com/package/cypress-visual-regression)

Module for visual regression testing and reporting for [Cypress](https://www.cypress.io/).

###### Visual Regression Demo

![example](./assets/visual-regression.gif)

###### Reporter Demo

![example](./assets/reporter-demo.gif)

## Getting Started

Install:

```sh
$ npm install cypress-lens
```

# 1. Setup visual regression

Add the following config to your _cypress.config.js_ file:

```js
const { defineConfig } = require("cypress");
const getCompareSnapshotsPlugin = require("cypress-lens/dist/plugin");

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

```js
const compareSnapshotCommand = require("cypress-lens/dist/command");

compareSnapshotCommand();
```

> Make sure you import _commands.js_ in _cypress/support/e2e.js_:
>
> ```js
> import "./commands";
> ```

### TypeScript

_cypress/tsconfig.json_

```json
{
  "compilerOptions": {
    "types": ["cypress", "cypress-lens"]
  }
}
```

# 1. Setup reporter

Install cypress-multi-reporters:
This plugin allows us to use more than one reporters since we want to keep the cypress default spec reports.

```sh
$ npm install cypress-multi-reporters
```

Create reporter-config.json and place the following code

```json
{
  "reporterEnabled": "spec, cypress-lens"
}
```

Add the following config to your _cypress.config.js_ file:

```js
const { defineConfig } = require("cypress");
const getCompareSnapshotsPlugin = require("cypress-lens/dist/plugin");

module.exports = defineConfig({
  screenshotsFolder: "./cypress/snapshots/actual",
  trashAssetsBeforeRuns: true,
  video: false,
  e2e: {
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      configFile: "reporter-config.json",
    },
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
    },
  },
});
```

# 3. How to use

```js
it("Should display the home page according to baseline snapshot", () => {
  cy.visit("www.dreamshot.bg");
  cy.compareSnapshot("home-page");
});
```

### Options

`failSilently` is enabled by default. Add the following config to your cypress.config.js file to see the errors:

```js
{
  env: {
    failSilently: false;
  }
}
```

You can also pass default arguments to `compareSnapshotCommand()`:

```js
const compareSnapshotCommand = require("cypress-visual-regression/dist/command");

compareSnapshotCommand({
  capture: "fullPage",
});
```

These will be used by default when no parameters are passed to the compareSnapshot command.

### Take the base images:

```sh
$ ./node_modules/.bin/cypress run --env type=base"
```

### Find regressions:

```sh
$ ./node_modules/.bin/cypress run --env type=actual
```
