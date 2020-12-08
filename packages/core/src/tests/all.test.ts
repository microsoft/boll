import { suite } from "@boll/test-internal";

import { test as ConfigTest } from "./config.test";
import { test as FormatTest } from "./format.test";
import { test as GitUtilsTest } from "./git-utils.test";
import { test as GlobTest } from "./glob.test";
import { test as IgnoreTest } from "./ignore.test";
import { test as PragmaTest } from "./pragma.test";
import { test as SuiteTest } from "./suite.test";

suite(ConfigTest, FormatTest, GitUtilsTest, GlobTest, IgnoreTest, PragmaTest, SuiteTest);
