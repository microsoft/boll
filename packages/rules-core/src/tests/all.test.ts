import { test as EnforceRationaleTest } from "./enforce-rationale.test";
import { test as NoRedundantDepsTest } from "./no-redundant-deps.test";
import { test as PackageConsistencyTest } from "./package-consistency.test";

async function suite() {
  await EnforceRationaleTest.run();
  await NoRedundantDepsTest.run();
  await PackageConsistencyTest.run();
}

suite();
