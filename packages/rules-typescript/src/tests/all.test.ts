import { test as CrossPackageDepDetectorTest } from "./cross-package-dep-detector.test";
import { test as NodeModulesReferenceDetectorTest } from "./node-modules-reference-detector.test";
import { test as RedundantImportsDetectorTest } from "./redundant-imports-detector.test";
import { test as SrcDetectorTest } from "./src-detector.test";
import { test as TransitiveDependencyDetectorTest } from "./transitive-dependency-detector.test";

async function suite() {
  await CrossPackageDepDetectorTest.run();
  await NodeModulesReferenceDetectorTest.run();
  await RedundantImportsDetectorTest.run();
  await SrcDetectorTest.run();
  await TransitiveDependencyDetectorTest.run();
}

suite();
