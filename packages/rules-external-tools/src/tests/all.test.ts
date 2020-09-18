import { test as EslintRulesTest } from "./eslint-rules.test";
import { test as EslintPreferConstTest } from "./eslint-prefer-const-rule.test";

async function suite() {
  await EslintPreferConstTest.run();
  await EslintRulesTest.run();
}

suite();
