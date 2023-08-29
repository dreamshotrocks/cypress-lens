# Cypress Lens

[![npm](https://img.shields.io/npm/v/cypress-visual-regression)](https://www.npmjs.com/package/cypress-visual-regression)

[![github actions](https://github.com/mjhea0/cypress-visual-regression/workflows/Continuous%20Integration/badge.svg)](https://github.com/mjhea0/cypress-visual-regression/actions)

Based on [Cypress Visual Regression](https://www.npmjs.com/package/cypress-visual-regression)

Module for visual regression testing and reporting for [Cypress](https://www.cypress.io/).

## Getting Started

Install:

```sh
$ npm install cypress-lens
```

Add the following config to your *cypress.config.js* file:

```javascript
const { defineConfig } = require("cypress");
const getCompareSnapshotsPlugin = require('cypress-visual-regression/dist/plugin');

module.exports = defineConfig({
  screenshotsFolder: './cypress/snapshots/actual',
  trashAssetsBeforeRuns: true,
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
    },
  },
});
```

Add the command to *cypress/support/commands.js*:

```javascript
const compareSnapshotCommand = require('cypress-visual-regression/dist/command');

compareSnapshotCommand();
```

> Make sure you import *commands.js* in *cypress/support/e2e.js*:
>
> ```javascript
> import './commands'
> ```

### TypeScript

If you're using TypeScript, use files with a `.ts` extension, as follows:

*cypress/cypress.config.ts*

```ts
import { defineConfig } from 'cypress';
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin';

export default defineConfig({
  env: {
    screenshotsFolder: './cypress/snapshots/actual',
    trashAssetsBeforeRuns: true,
    video: false
  },
  e2e: {
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
    },
  },
});
```

*cypress/support/commands.ts*

```ts
import compareSnapshotCommand from 'cypress-visual-regression/dist/command';

compareSnapshotCommand();
```

*cypress/tsconfig.json*

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
