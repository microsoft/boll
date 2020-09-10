import { test as CliTest } from "./cli.test";
import { test as ConfigTest } from "./config.test";
import { test as CrossPackageDepDetectorTest } from "./cross-package-dep-detector.test";
import { test as E2ETest } from "./e2e.test";
import { test as ESLintPreferConstRuleTest } from "./eslint-prefer-const-rule.test";
import { test as ESLintRulesTest } from "./eslint-rules.test";
import { test as FormatTest } from "./format.test";
import { test as GlobTest } from "./glob.test";
import { test as NodeModulesReferenceDetectorTest } from "./node-modules-reference-detector.test";
import { test as RedundantImportsDetectorTest } from "./redundant-imports-detector.test";
import { test as SrcDetectorTest } from "./src-detector.test";

async function suite() {
  await CliTest.run();
  await ConfigTest.run();
  await CrossPackageDepDetectorTest.run();
  await E2ETest.run();
  await ESLintPreferConstRuleTest.run();
  await ESLintRulesTest.run();
  await FormatTest.run();
  await GlobTest.run();
  await NodeModulesReferenceDetectorTest.run();
  await RedundantImportsDetectorTest.run();
  await SrcDetectorTest.run();
}

suite();
