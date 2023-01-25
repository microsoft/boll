import * as assert from "assert";
import baretest from "baretest";
import { TransitiveDependencyDetector } from "../transitive-dependency-detector";
import { asBollDirectory, getSourceFile, Failure, Package, ResultStatus } from "@boll/core";
import { inFixtureDir } from "@boll/test-internal";

export const test: any = baretest("Transitive dep detector");

test("(dependencies only mode) Should fail if any references to packages not referenced in package", async () => {
  await inFixtureDir("transitive-reference", __dirname, async () => {
    const sut = new TransitiveDependencyDetector();
    const result = await sut.check(await getSourceFile(asBollDirectory("."), "foo.ts", {}));
    assert.strictEqual(1, result.length);
    assert.strictEqual(ResultStatus.failure, result[0].status);
    const expected = "@some/other-package";
    const containsExpected = result[0].formattedMessage.includes(expected);
    assert.ok(containsExpected, `Expected "${result[0].formattedMessage}" to contain "${expected}", but didn't.`);
  });
});

test("Should allow any modules given to the constructor", async () => {
  const sut = new TransitiveDependencyDetector({ ignorePackages: ["util"] });
  assert.ok(sut.isValidImport({}, {}, "util"));
  assert.ok(!sut.isValidImport({}, {}, "fs"));
});

test("Should succeed if all imports are declared in dependencies", async () => {
  await inFixtureDir("transitive-reference", __dirname, async () => {
    const sut = new TransitiveDependencyDetector();
    const result = await sut.check(
      await getSourceFile(asBollDirectory("."), "foo.ts", { dependencies: { "@some/other-package": "0" } })
    );
    assert.strictEqual(0, result.length);
  });
});

test("Should succeed if all imports are declared in devDependencies and devDeps mode is enabled", async () => {
  await inFixtureDir("transitive-reference", __dirname, async () => {
    const sut = new TransitiveDependencyDetector({ allowDevDependencies: true });
    const result = await sut.check(
      await getSourceFile(asBollDirectory("."), "foo.ts", { devDependencies: { "@some/other-package": "0" } })
    );
    assert.strictEqual(0, result.length);
  });
});

test("Should fail if all imports are declared in devDependencies and devDeps mode is disabled", async () => {
  await inFixtureDir("transitive-reference", __dirname, async () => {
    const sut = new TransitiveDependencyDetector({ allowDevDependencies: false });
    const result = await sut.check(
      await getSourceFile(asBollDirectory("."), "foo.ts", { devDependencies: { "@some/other-package": "0" } })
    );
    assert.strictEqual(1, result.length);
    const failure = result[0] as Failure;
    assert.strictEqual(ResultStatus.failure, failure.status);
    assert.strictEqual(1, failure.line);
  });
});

test("Should fail for missing imports if few imports are declared in devDependencies and devDeps mode is enabled", async () => {
  await inFixtureDir("transitive-reference", __dirname, async () => {
    const sut = new TransitiveDependencyDetector({ allowDevDependencies: true });
    const result = await sut.check(
      await getSourceFile(asBollDirectory("."), "transitive-reference.ts", {
        devDependencies: { "@some/other-package": "0" }
      })
    );
    const failure = result[0] as Failure;
    const failure1 = result[1] as Failure;
    const failure2 = result[2] as Failure;
    assert.strictEqual(3, result.length);
    assert.strictEqual(ResultStatus.failure, failure.status);
    assert.strictEqual(1, failure.line);
    assert.strictEqual(ResultStatus.failure, failure1.status);
    assert.strictEqual(8, failure1.line);
    assert.strictEqual(ResultStatus.failure, failure2.status);
    assert.strictEqual(9, failure2.line);
  });
});
