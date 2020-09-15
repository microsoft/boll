import { test as CliTest } from "./cli.test";
import { test as ConfigRuleBaseTest } from "./config-rule-base.test";
import { test as CrossPackageDepDetectorTest } from "./cross-package-dep-detector.test";
import { test as E2ETest } from "./e2e.test";
import { test as NodeModulesReferenceDetectorTest } from "./node-modules-reference-detector.test";
import { test as RedundantImportsDetectorTest } from "./redundant-imports-detector.test";
import { test as SrcDetectorTest } from "./src-detector.test";

async function suite() {
  await CliTest.run();
  await ConfigRuleBaseTest.run();
  await CrossPackageDepDetectorTest.run();
  await E2ETest.run();
  await NodeModulesReferenceDetectorTest.run();
  await RedundantImportsDetectorTest.run();
  await SrcDetectorTest.run();
}

suite();
