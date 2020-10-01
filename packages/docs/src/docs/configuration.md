# Configuration

Boll is configured by way of the `.boll.config.js` file in the root of a given package.

Each boll configuration must load rules to be run across the repository. It may either
extend an existing configuration or fabricate a new configuration.

## Extending an existing configuration

To extend an configuration, first make sure rules are loaded, then export an object with
an `extends` key.

```js
"use strict";
const { bootstrapRecommendedConfiguration } = require('@boll/recommended');
bootstrapRecommendedConfiguration();
module.exports = {
    extends: "boll:recommended"
};
```

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