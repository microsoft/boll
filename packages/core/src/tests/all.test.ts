import { test as ConfigTest } from "./config.test";
import { test as FormatTest } from "./format.test";
import { test as GlobTest } from "./glob.test";
import { test as IgnoreTest } from "./ignore.test";
import { test as PragmaTest } from "./pragma.test";

async function suite() {
  await ConfigTest.run();
  await FormatTest.run();
  await GlobTest.run();
  await IgnoreTest.run();
  await PragmaTest.run();
}

suite();
