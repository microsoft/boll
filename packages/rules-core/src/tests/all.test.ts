import { test as NoAddRootResolutionsTest } from "./no-add-root-resolutions.test";
import { test as NoRedundantDepsTest } from "./no-redundant-deps.test";

async function suite() {
  await NoAddRootResolutionsTest.run();
  await NoRedundantDepsTest.run();
}

suite();
