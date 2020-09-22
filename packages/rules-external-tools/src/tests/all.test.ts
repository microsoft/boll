import { test as EslintRulesTest } from "./eslint-rules.test";
import { test as EslintPreferConstTest } from "./eslint-prefer-const-rule.test";
import { test as PackageManifestNoAddRootResolutionsTest } from "./package-manifest-no-add-root-resolutions.test";

async function suite() {
  await EslintPreferConstTest.run();
  await EslintRulesTest.run();
  await PackageManifestNoAddRootResolutionsTest.run();
}

suite();
