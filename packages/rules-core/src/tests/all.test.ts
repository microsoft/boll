<<<<<<< HEAD
import { test as NoAddRootResolutionsTest } from "./no-add-root-resolutions.test";
import { test as NoRedundantDepsTest } from "./no-redundant-deps.test";

async function suite() {
  await NoAddRootResolutionsTest.run();
=======
import { test as NoRedundantDepsTest } from "./no-redundant-deps.test";

async function suite() {
>>>>>>> main
  await NoRedundantDepsTest.run();
}

suite();
