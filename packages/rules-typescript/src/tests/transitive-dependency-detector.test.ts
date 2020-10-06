import * as assert from "assert";
import baretest from "baretest";
import { TransitiveDependencyDetector } from "../transitive-dependency-detector";
import { asBollDirectory, getSourceFile, Package, ResultStatus } from "@boll/core";
import { inFixtureDir } from "@boll/test-internal";

export const test: any = baretest("Transitive dep detector");

test("Should fail if any references to packages not referenced in package", async () => {
  inFixtureDir("transitive-reference", __dirname, async () => {
    const sut = new TransitiveDependencyDetector();
    const result = await sut.check(await getSourceFile(asBollDirectory("."), "foo.ts", new Package({})));
    assert.strictEqual(1, result.length);
    assert.strictEqual(ResultStatus.failure, result[0].status);
    const expected = "@some/other-package";
    const containsExpected = result[0].formattedMessage.includes(expected);
    assert.ok(containsExpected, `Expected "${result[0].formattedMessage}" to contain "${expected}", but didn't.`);
  });
});
