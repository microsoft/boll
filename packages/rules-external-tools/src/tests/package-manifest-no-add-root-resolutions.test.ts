import * as assert from "assert";
import baretest from "baretest";
import { execSync } from "child_process";
import { inFixtureDir, inTmpBranch, tmpWriteToFile } from "./test-helper";
import {
  asBollDirectory,
  asBollFile,
  getSourceFile,
  NullLogger,
  Package,
  PackageManifestContext,
  ResultStatus
} from "@boll/core";
import { PackageManifestNoAddRootResolutions } from "../rules/package-manifest-no-add-root-resolutions";

export const test: any = baretest("Package Manifest");

test("Should succeed since no changes are made to package.json", async () => {
  await inFixtureDir("configs/package-manifests", async () => {
    const currentBranch = execSync("git branch --show-current").toString().trim();
    await inTmpBranch(async () => {
      const sut = new PackageManifestNoAddRootResolutions(currentBranch);
      const results = await sut.check(new PackageManifestContext(asBollFile("package.json")));
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].status, ResultStatus.success);
    });
  });
});

test("Should succeed because changes that were made to a package.json file that is not in the root of the repository", async () => {
  await inFixtureDir("configs/package-manifests", async () => {
    const currentBranch = execSync("git branch --show-current").toString().trim();
    await inTmpBranch(async () => {
      await tmpWriteToFile(asBollFile("copies/main-with-additions.json"), asBollFile("foo/package.json"), async () => {
        const sut = new PackageManifestNoAddRootResolutions(currentBranch);
        const results = await sut.check(new PackageManifestContext(asBollFile("foo/package.json")));
        assert.strictEqual(results.length, 1);
        assert.strictEqual(results[0].status, ResultStatus.success);
      });
    });
  });
});

test("Should fail because this adds dependencies to root package.json", async () => {
  await inFixtureDir("configs/package-manifests", async () => {
    const currentBranch = execSync("git branch --show-current").toString().trim();
    await inTmpBranch(async () => {
      await tmpWriteToFile(asBollFile("copies/main-with-additions.json"), asBollFile("package.json"), async () => {
        const sut = new PackageManifestNoAddRootResolutions(currentBranch);
        const results = await sut.check(new PackageManifestContext(asBollFile("package.json")));
        assert.strictEqual(results.length, 7);
        assert.strictEqual(
          results.map(r => (r.status === ResultStatus.success ? true : false)).reduce((p, c) => p || c),
          false
        );
      });
    });
  });
});

test("Should fail because it adds (as well as removes) dependencies from root package.json", async () => {
  await inFixtureDir("configs/package-manifests", async () => {
    const currentBranch = execSync("git branch --show-current").toString().trim();
    await inTmpBranch(async () => {
      await tmpWriteToFile(
        asBollFile("copies/main-with-additions-and-removals.json"),
        asBollFile("package.json"),
        async () => {
          const sut = new PackageManifestNoAddRootResolutions(currentBranch);
          const results = await sut.check(new PackageManifestContext(asBollFile("package.json")));
          assert.strictEqual(results.length, 2);
          assert.strictEqual(
            results.map(r => (r.status === ResultStatus.success ? true : false)).reduce((p, c) => p || c),
            false
          );
        }
      );
    });
  });
});
