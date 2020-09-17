import { test as CliTest } from "./cli.test";
import { test as ConfigRuleBaseTest } from "./config-rule-base.test";

async function suite() {
  await CliTest.run();
  await ConfigRuleBaseTest.run();
}

suite();
