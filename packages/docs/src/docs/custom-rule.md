# Advanced configuration: Custom rules

In this walkthrough, we will create a new file locator and rule from scratch.

Our task will be to verify that prettier is configured to enforce single quotes (the `singleQuote` directive in prettier's configuration).

## File locator

The locator must implement the [`FileGlob`](../api/core/interfaces/fileglob) interface. In short, it must
expose properties `include` and `exclude` (both string arrays) that can be set at runtime based on user configuration.
It must also expose `findFiles()`, which returns a promise that resolves to a list of filenames.

Since we know the name of the file we want to find and the expected location (`.prettierrc` in the root of the pacakge),
there's no need to search for any files. We can simply return a resolved promise.

```js
"use strict";

const prettierRcLocator = {
    findFiles: () => {
        return new Promise((resolve) => {
            resolve(['.prettierrc']);
        });
    }
}

module.exports = {
    ruleSets: [{
        fileLocator: prettierRcLocator,
        checks: []
    }]
};
```

## Check for singleQuote

Next we will verify that the prettier configuration meets expectations.

### Create the rule

Our rule must expose a `name` attribute and a `check` method.

The name is used when printing errors, so should be a unique and descriptive label that will be useful in CI output.

The check method will be passed 1 [`FileContext`](../api/core/classes/filecontext) object at a time, and must return a promise that resolves to a list of `Result` objects ([`Success`](../api/core/classes/success) and [`Failure`](../api/core/classes/failure) being the most common).

```js
const { Success, Failure } = require('@boll/core');

const prettierRcSingleQuoteChecker = {
    name: "PrettierRcSingleQuoteChecker",
    check: (file) => {
        return new Promise((resolve) => {
            const contents = JSON.parse(file.content);
            if(contents.singleQuote) {
                resolve([new Success()]);
            }
            else {
                resolve([new Failure("PrettierRcSingleQuoteChecker", file.filename, 0, "Expected singleQuote to be true, but wasn't!")]);
            }
        });
    }
}
```

### Register the rule

The rule must be registered with boll so that it can be invoked during the run.

```js
const { RuleRegistryInstance } = require("@boll/core");
RuleRegistryInstance.register("PrettierRcSingleQuoteChecker", () => prettierRcSingleQuoteChecker);
```

There is also an API for `addRule` which simply takes an object instead of a factory function.
The `logger` and the `options` will be passed into the `check` function along with the `file`.

```js
const { addRule } = require("@boll/core");
addRule({
  name: "PrettierRcSingleQuoteChecker",
  check: (file, options) => {...}
})
```

### Putting it altogether

With the locator and check in place, we just need to mention the rule inside the `checks` block of the exported config. The entire `.boll.config.js` looks this way after adding this last bit of config.

```js
"use strict";

const { RuleRegistryInstance, Success, Failure } = require('@boll/core');

const prettierRcSingleQuoteChecker = {
    name: "PrettierRcSingleQuoteChecker",
    check: (file) => {
        return new Promise((resolve) => {
            const contents = JSON.parse(file.content);
            if(contents.singleQuote) {
                resolve([new Success()]);
            }
            else {
                resolve([new Failure("PrettierRcSingleQuoteChecker", file.filename, 0, "Expected singleQuote to be true, but wasn't!")]);
            }
        });
    }
};

const prettierRcLocator = {
    findFiles: () => {
        return new Promise((resolve) => {
            resolve(['.prettierrc']);
        });
    }
}

RuleRegistryInstance.register("PrettierRcSingleQuoteChecker", () => prettierRcSingleQuoteChecker);

module.exports = {
    ruleSets: [{
        fileLocator: prettierRcLocator,
        checks: [{rule: "PrettierRcSingleQuoteChecker"}]
    }]
};
```

Now, running with an incorrect `.prettierrc`:

```json
{
  "singleQuote": false
}
```

```sh
[/tmp/sample-project]# ./node_modules/.bin/boll run
[PrettierRcSingleQuoteChecker] /private/tmp/sample-project/.prettierrc:0 Expected singleQuote to be true, but wasn't!
@boll/cli detected lint errors
```

However, after fixing:
```json
{
  "singleQuote": true
}
```

```sh
[/tmp/sample-project]# ./node_modules/.bin/boll run
[/tmp/sample-project]# echo $?
0
```