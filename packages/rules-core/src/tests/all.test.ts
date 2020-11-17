import { suite } from "@boll/test-internal";

import { test as EnforceRationaleTest } from "./enforce-rationale.test";
import { test as NoRedundantDepsTest } from "./no-redundant-deps.test";
import { test as PackageConsistencyTest } from "./package-consistency.test";

suite(EnforceRationaleTest, NoRedundantDepsTest, PackageConsistencyTest);
