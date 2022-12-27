import * as assert from "assert";
import baretest from "baretest";
import { ESLintPreferConstRule } from "../eslint-prefer-const-rule";
import { asBollDirectory, getSourceFile, NullLogger, Package, ResultStatus } from "@boll/core";
import { inFixtureDir } from "@boll/test-internal";

export const test: any = baretest("ESLint Prefer Const");

test("Should succeed because prefer-const rule is set to 'error'", async () => {
  await inFixtureDir("configs/eslint/prefer-const", __dirname, async () => {
    const sut = new ESLintPreferConstRule(NullLogger);
    const results = await sut.check(await getSourceFile(asBollDirectory("."), "prefer-const.ts", {}));
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].status, ResultStatus.success);
  });
});

test("Should fail because prefer-const rule is set to 'off'", async () => {
  await inFixtureDir("configs/eslint/prefer-const/prefer-const-off", __dirname, async () => {
    const sut = new ESLintPreferConstRule(NullLogger);
    const results = await sut.check(await getSourceFile(asBollDirectory("."), "prefer-const-off.ts", {}));
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].status, ResultStatus.failure);
    assert.strictEqual(
      results[0].formattedMessage.includes(`prefer-const rule exists but at level "off" instead of "error"`),
      true
    );
  });
});
