import { test as ConfigTest } from "./config.test";
import { test as ESLintRulesTest } from "./eslint-rules.test";
import { test as FormatTest } from "./format.test";
import { test as GlobTest } from "./glob.test";
import { test as PragmaTest } from "./pragma.test";

async function suite() {
  await ConfigTest.run();
  await ESLintRulesTest.run();
  await FormatTest.run();
  await GlobTest.run();
  await PragmaTest.run();
}

suite();
