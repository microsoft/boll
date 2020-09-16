import { TSLintRules } from "../tslint-rules";
import { test as ConfigTest } from "./config.test";
import { test as FormatTest } from "./format.test";
import { test as GlobTest } from "./glob.test";
import { test as PragmaTest } from "./pragma.test";
import { test as TSLintRulesTest } from "./tslint-rules.test";

async function suite() {
  await ConfigTest.run();
  await FormatTest.run();
  await GlobTest.run();
  await PragmaTest.run();
  await TSLintRulesTest.run();
}

suite();
