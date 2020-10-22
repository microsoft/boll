import * as assert from "assert";
import baretest from "baretest";
import { NodeModulesReferenceDetector } from "../node-modules-reference-detector";
import { asBollDirectory, getSourceFile, Package, ResultStatus } from "@boll/core";
import { inFixtureDir } from "@boll/test-internal";

export const test: any = baretest("Node modules reference detector");

test("Should pass if no references to node_modules exist in source code", async () => {
  inFixtureDir("node-modules-references", __dirname, async () => {
    const sut = new NodeModulesReferenceDetector();
    const result = await sut.check(
      await getSourceFile(asBollDirectory("."), "node-modules-reference-none.ts", new Package({}, {}))
    );
    assert.strictEqual(1, result.length);
    assert.strictEqual(ResultStatus.success, result[0].status);
  });
});

test("Should fail if references to node_modules exist in source code", async () => {
  inFixtureDir("node-modules-references", __dirname, async () => {
    const sut = new NodeModulesReferenceDetector();
    const result = await sut.check(
      await getSourceFile(asBollDirectory("."), "node-modules-reference.ts", new Package({}, {}))
    );
    assert.strictEqual(2, result.length);
    assert.strictEqual(ResultStatus.failure, result[0].status);
    assert.strictEqual(ResultStatus.failure, result[1].status);
  });
});
