# Running boll

## CLI usage

Use `npx` (or your package's preferred launcher) to run `boll` in the root of each package.

```sh
npx boll run
```

## Library usage

In order to integrate with other schedulers and build tools, it is
easy to launch `boll` from within an already running node process.

First, import the configuration registry and bootstrap so that other
rules can be run successfully.

```js
import { ConfigRegistryInstance } from "@boll/cli/dist/lib/config-registry";

ConfigRegistryInstance.register(baseConfig);
```

Next, call `runBoll`.

```js
import { runBoll } from "@boll/cli/dist/main";

const result = await runBoll();
if (!result) {
  throw new Error("boll (repo-wide linter) failed; please inspect previous output.");
}
```

See details on [`ConfigRegistryInstance.register`](../api/classes/configregistry.html#register) and [`runBoll`](../api/globals.html#runboll).
