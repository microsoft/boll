# Configuration

Boll is configured by way of the `.boll.config.js` file in the root of a given package.

Each boll configuration must load rules to be run across the repository. It may either
extend an existing configuration or fabricate a new configuration.

## Creating a new configuration

A configuration is a list of `RuleSet` objects. Each `RuleSet` must define a `fileLocator`
and a set of checks to run against all matched files.

The following example loads a specific TypeScript check from the TypeScript package, registers it, then creates a
ruleset to run that check only.

```js
"use strict";
const { RuleRegistryInstance, TypescriptSourceGlob } = require("@boll/core");
const { SrcDetector } = require("@boll/rules-typescript");

RuleRegistryInstance.register("SrcDetector", () => new SrcDetector());

module.exports = {
    ruleSets: [{
        fileLocator: new TypescriptSourceGlob(),
        checks: [{rule: "SrcDetector"}]
    }]
};
```

`@boll/core` provides several `fileLocator` implementations (see [FileGlob](../api/core/interfaces/fileglob)) out of the box.


[Learn how to create rules](custom-rule)

## Extending an existing configuration

To extend an configuration, install the plugin and export an object with
an `extends` key.

```js
"use strict";

module.exports = {
    extends: "boll:recommended"
};
```

You may also extend from multiple plugins.
```js
"use strict";

module.exports = {
    extends: ["boll:recommended","plugin:check-readme"]
};
```

## Creating a plugin
A plugin is a configuration that can be extended from to provide additional rules. To create a plugin,
create a module which exports a `bootstrap` function. The plugin's configuration name also has to begin with the prefix `plugin:`.

```js
"use strict";
const { addRule, WorkspacesGlob, ConfigRegistryInstance } = require("@boll/core");
// a custom created rule to check readme file
const { ensureReadMe } = require("./rules/readme");

const readMeConfig = {
  name: "plugin:check-readme",
  ruleSets: [
    {
      fileLocator: new WorkspacesGlob(),
      checks: {
        file: [{ rule: "ensureReadMe" }]
      }
    }
  ]
};

function bootstrap() {
    addRule(ensureReadme);
    ConfigRegistryInstance.register(readMeConfig);
}

module.exports = {
    bootstrap
};
```
