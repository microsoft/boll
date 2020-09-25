import { test as NoRedundantDepsTest } from "./no-redundant-deps.test";

async function suite() {
  await NoRedundantDepsTest.run();
}

suite();
