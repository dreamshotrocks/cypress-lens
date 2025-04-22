const fs = require("fs");
const path = require("path");
const stripAnsi = require("strip-ansi");
const sanitize = require("sanitize-filename");

var INVALID_CHARACTERS_REGEX =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007f-\u0084\u0086-\u009f\uD800-\uDFFF\uFDD0-\uFDFF\uFFFF\uC008]/g; //eslint-disable-line no-control-regex

function removeInvalidCharacters(input) {
  if (!input) {
    return input;
  }
  return input.replace(INVALID_CHARACTERS_REGEX, "");
}

function readWriteSync(text) {
  let data = `
  <!DOCTYPE html>
<html>
<head>
    <link href="./static/css/main.css" rel="stylesheet" />
    <script src="./data.js"></script>
  </head>   
  <body>
    <div id="root"></div>
    <script src="./static/js/main.js"></script>
  </body>
</html>
  `;
  fs.writeFileSync(path.resolve("./cypress/report/index.html"), data, "utf-8");
  fs.writeFileSync(
    path.resolve("./cypress/report/data.js"),
    `var testData = ${text}`,
    "utf-8"
  );
}

var testsuites = [];

function Reporter(runner, options) {
  this._options = options;
  this._runner = runner;

  this._reportDir = path.resolve(`./cypress/report`);

  this._runner.on("suite", (suite) => {
    if (suite.title && suite.title.length > 0 && suite.tests.length > 0) {
      testsuites.push(this.getTestsuiteData(suite));
    }
  });

  this._runner.on("pass", (test) => {
    this.lastSuite().tests.push(this.getTestcaseData(test));
  });

  this._runner.on("fail", (test, err) => {
    this.lastSuite().tests.push(this.getTestcaseData(test, err));
  });

  this._runner.on("end", () => {
    fs.cpSync(
      path.resolve(`./node_modules/cypress-lens/build/static`),
      path.resolve(`./cypress/report/static/`),
      { recursive: true }
    );
    readWriteSync(JSON.stringify(testsuites));
  });
}

Reporter.prototype.lastSuite = function () {
  return testsuites[testsuites.length - 1];
};

Reporter.prototype.getTestsuiteData = function (suite) {
  return {
    props: {
      name: stripAnsi(suite.title),
      tests: suite.tests && suite.tests.length,
    },
    tests: [],
  };
};

Reporter.prototype.getSnapshotsData = function (test) {
  const testTitle = sanitize(test.title);
  let pathTitle;
  const titlePattern =
    this._options.reporterOptions && this._options.reporterOptions.titlePattern;
  if (titlePattern) {
    const regexp = new RegExp(titlePattern, "g");
    pathTitle = testTitle.match(regexp)[0];
  } else {
    pathTitle = sanitize(test.title).split(" ").join("-");
  }

  let snapshots = [];
  let resolutions = [];
  let rootFileName = "";
  const testPath =
    test.invocationDetails.fileUrl.split("p=")[1].replace(/\\/g, "/") +
    "/" +
    pathTitle;
  let basePath = path.resolve(`./cypress/snapshots/base/${testPath}`);

  const files = fs.readdirSync(basePath);

  fs.existsSync(basePath) &&
    files.forEach((file, index) => {
      const currentFileName = file.replace(/-\d{3,4}-\d{3,4}\.png$/g, "");
      const resolution = file.match(/\d{3,4}-\d{3,4}/)[0];
      fs.mkdirSync(
        path.resolve(`./cypress/report/snapshots/${testPath}/${file}`),
        {
          recursive: true,
        }
      );

      let extraData = {};

      //base
      fs.copyFileSync(
        path.resolve(`./cypress/snapshots/base/${testPath}/${file}`),
        path.resolve(`./cypress/report/snapshots/${testPath}/${file}/base.png`)
      );

      if (
        fs.existsSync(
          path.resolve(`./cypress/snapshots/diff/${testPath}/${file}`)
        )
      ) {
        //diff
        fs.copyFileSync(
          path.resolve(`./cypress/snapshots/diff/${testPath}/${file}`),
          path.resolve(
            `./cypress/report/snapshots/${testPath}/${file}/diff.png`
          )
        );

        try {
          const rawdata = fs.readFileSync(
            `./cypress/snapshots/diff/${testPath}/${file.replace(
              ".png",
              ".json"
            )}`
          );

          extraData = JSON.parse(rawdata);
        } catch {}

        //new
        if (
          fs.existsSync(
            path.resolve(`./cypress/snapshots/actual/${testPath}/${file}`)
          )
        ) {
          fs.copyFileSync(
            path.resolve(`./cypress/snapshots/actual/${testPath}/${file}`),
            path.resolve(
              `./cypress/report/snapshots/${testPath}/${file}/new.png`
            )
          );
        }
      }

      if (currentFileName !== rootFileName && resolutions.length > 0) {
        snapshots.push({
          props: {
            name: rootFileName,
          },
          resolutions,
        });

        resolutions = [];
      }

      rootFileName = currentFileName;

      resolutions.push({
        size: resolution,
        images: {
          base: `snapshots/${testPath}/${file}/base.png`,
          new: `snapshots/${testPath}/${file}/new.png`,
          diff: `snapshots/${testPath}/${file}/diff.png`,
        },
        extraData,
      });

      if (index === files.length - 1) {
        snapshots.push({
          props: { name: rootFileName },
          resolutions,
        });
      }
    });

  return snapshots;
};

Reporter.prototype.getTestcaseData = function (test, err) {
  var testcase = {
    props: {
      name: test.title,
      time: typeof test.duration === "undefined" ? 0 : test.duration / 1000,
    },
    snapshots: this.getSnapshotsData(test),
  };

  if (err) {
    testcase.failure = {
      message: removeInvalidCharacters(err.message || "")
        .replace(/"/g, "'")
        .replace(/\n/g, ""),
    };
    const percentage = err.message.match(/Actual: (.+)/);
    if (percentage && percentage.length > 0) {
      testcase.failure.percentage = percentage[1];
    }
  }

  return testcase;
};

module.exports = Reporter;
