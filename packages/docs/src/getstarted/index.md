---
sidebar: auto
---

# Getting started with boll

## Install

To install, add `@boll/cli` as a dev dependency to your package with
your package manager of choice.

```sh
npm install --save-dev @boll/cli
```

## Configure

Next, run the `init` command to generate a configuration file that
will be used when boll runs.

```sh
npx boll init
```

This command will create a configuration file called `.boll.config.js`
in your current directory, implementing the recoommended configuration
by default. It should look like the following.

```js
"use strict";
module.exports = {
  extends: "boll:recommended"
};
```

## Run

To run `boll`, simply pass the `run` command.

```sh
npx boll run
```

If everything is configured successfully and your project contains no
boll violations, the command will exit with no output and an exit
status of `0`.

## Next steps

Learn about configuring, tweaking, or adding rules in [the docs](./../docs).
