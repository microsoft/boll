import * as assert from "assert";
import baretest from "baretest";
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

export const test: any = baretest("ESLint Prefer Const");

test("", () => {
  inFixtureDir("configs/package-manifests", async () => {
    inTmpBranch(async () => {
      const sut = new PackageManifestNoAddRootResolutions();
      const results = await sut.check(new PackageManifestContext(asBollFile("package.json")));
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].status, ResultStatus.success);
    });
  });
});

test("", () => {
  inFixtureDir("configs/package-manifests", async () => {
    inTmpBranch(async () => {
      tmpWriteToFile(asBollFile("copies/main-with-additions.json"), asBollFile("foo/package.json"), async () => {
        const sut = new PackageManifestNoAddRootResolutions();
        const results = await sut.check(new PackageManifestContext(asBollFile("foo/package.json")));
        assert.strictEqual(results.length, 1);
        assert.strictEqual(results[0].status, ResultStatus.success);
      });
    });
  });
});

test("", () => {
  inFixtureDir("configs/package-manifests", async () => {
    inTmpBranch(async () => {
      tmpWriteToFile(asBollFile("copies/main-with-additions.json"), asBollFile("package.json"), async () => {
        const sut = new PackageManifestNoAddRootResolutions();
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
