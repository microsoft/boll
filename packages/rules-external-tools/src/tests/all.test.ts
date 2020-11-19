import { suite } from "@boll/test-internal";

import { test as EslintPreferConstTest } from "./eslint-prefer-const-rule.test";
import { test as EslintRulesTest } from "./eslint-rules.test";

suite(EslintPreferConstTest, EslintRulesTest);
