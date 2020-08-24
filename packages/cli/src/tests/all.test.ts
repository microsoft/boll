import { test as SrcDetectorTest } from "./src-detector.test";
import { test as CrossPackageDepDetectorTest } from "./cross-package-dep-detector.test";
import { test as CliTest } from "./cli.test";
import { test as E2ETest } from "./e2e.test";

async function suite() {
  await SrcDetectorTest.run();
  await CrossPackageDepDetectorTest.run();
  await CliTest.run();
  await E2ETest.run();
}

suite();
