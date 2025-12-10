# boll

Lint the whole repo.

## Getting started

### Install

To install, add `@boll/cli` as a dev dependency to your package with
your package manager of choice.

```sh
npm install --save-dev @boll/cli
```

### Configure

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

### Run

To run `boll`, simply pass the `run` command.

```sh
npx boll run
```

If everything is configured successfully and your project contains no
boll violations, the command will exit with no output and an exit
status of `0`.

### Next steps

Learn about configuring, tweaking, or adding rules in [the docs](https://microsoft.github.io/boll/).

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
