import { test as EnforceRationaleTest } from "./enforce-rationale.test";
import { test as NoRedundantDepsTest } from "./no-redundant-deps.test";

async function suite() {
  await EnforceRationaleTest.run();
  await NoRedundantDepsTest.run();
}

suite();
