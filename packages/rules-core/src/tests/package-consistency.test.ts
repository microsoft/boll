import * as assert from "assert";
import baretest from "baretest";
import { PackageConsistency } from "../package-consistency";
import { asBollDirectory, asBollFile, FileContext, Package, ResultStatus } from "@boll/core";

export const test: any = baretest("Package Consistency");

const sut = new PackageConsistency();

function buildFileContext(packageContents: {}) {
  return new FileContext(
    asBollDirectory("foo/bar/baz"),
    {},
    asBollFile("package.json"),
    JSON.stringify(packageContents)
  );
}

test("Passes when package.json is compliant", async () => {
  const result = await sut.check(
    buildFileContext({
      version: "1.0.0",
      private: true,
      name: "baz"
    })
  );
  assert.strictEqual(result.length, 0, "Expected empty result set");
});

test("Fails when package.json is missing a version number", async () => {
  const result = await sut.check(
    buildFileContext({
      name: "baz",
      private: true
    })
  );
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].status, ResultStatus.failure);
});

test("Fails when package.json is not specified private", async () => {
  const result = await sut.check(
    buildFileContext({
      name: "baz",
      version: "1.0.0"
    })
  );
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].status, ResultStatus.failure);
});

test("Succeeds when package.json is not specified private, but explicitly allowed", async () => {
  const sut = new PackageConsistency({ checkPrivatePackage: false });
  const result = await sut.check(
    buildFileContext({
      name: "baz",
      version: "1.0.0"
    })
  );
  assert.strictEqual(result.length, 0);
});

test("Fails when name deviates from directory path", async () => {
  const result = await sut.check(
    buildFileContext({
      version: "1.0.0",
      private: true,
      name: "baz2"
    })
  );
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].status, ResultStatus.failure);
});

test("Succeeds when name deviates from directory path and explicitly allowed", async () => {
  const sut = new PackageConsistency({ checkDirectoryName: false });
  const result = await sut.check(
    buildFileContext({
      version: "1.0.0",
      private: true,
      name: "baz2"
    })
  );
  assert.strictEqual(result.length, 0);
});

test("doNamesAlign", () => {
  assert.ok(sut.doNamesAlign("foo", asBollDirectory("/a/b/c/foo")));
  assert.ok(sut.doNamesAlign("@namespace/foo", asBollDirectory("/a/b/c/foo")));
  assert.ok(sut.doNamesAlign("foo", asBollDirectory("foo")));
  assert.ok(!sut.doNamesAlign("foo", asBollDirectory("/a/b/c/foo2")));
  assert.ok(!sut.doNamesAlign("@namespace/foo", asBollDirectory("/a/b/c/foo2")));
  assert.ok(!sut.doNamesAlign("foo", asBollDirectory("foo2")));
});
