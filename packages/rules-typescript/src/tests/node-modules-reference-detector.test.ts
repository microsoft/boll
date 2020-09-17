import * as assert from "assert";
import baretest from "baretest";
import path from "path";
import { NodeModulesReferenceDetector } from "../node-modules-reference-detector";
import { asBollDirectory, getSourceFile, Package, ResultStatus } from "@boll/core";
import { ESLintRules } from "@boll/core";
export const test: any = baretest("Node modules reference detector");

const TEST_FILE_DIR = path.join(__dirname, "..", "..", "fixtures", "node-modules-references");

test("Should pass if no references to node_modules exist in source code", async () => {
  const sut = new NodeModulesReferenceDetector();
  const result = await sut.check(
    await getSourceFile(
      asBollDirectory(TEST_FILE_DIR),
      path.join(TEST_FILE_DIR, "node-modules-reference-none.ts"),
      new Package({}),
      new ESLintRules()
    )
  );
  assert.strictEqual(1, result.length);
  assert.strictEqual(ResultStatus.success, result[0].status);
});

test("Should failt if references to node_modules exist in source code", async () => {
  const sut = new NodeModulesReferenceDetector();
  const result = await sut.check(
    await getSourceFile(
      asBollDirectory(TEST_FILE_DIR),
      path.join(TEST_FILE_DIR, "node-modules-reference.ts"),
      new Package({}),
      new ESLintRules()
    )
  );
  assert.strictEqual(2, result.length);
  assert.strictEqual(ResultStatus.failure, result[0].status);
  assert.strictEqual(ResultStatus.failure, result[1].status);
});
