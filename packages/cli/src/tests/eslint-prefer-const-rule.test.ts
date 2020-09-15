import * as assert from "assert";
import baretest from "baretest";
import { asBollFile } from "../lib/boll-file";
import { ESLintRules } from "../lib/eslint-rules";
import { inFixtureDir } from "./test-helper";
import { ESLintPreferConstRule } from "../rules/eslint-prefer-const-rule";
import { ResultStatus } from "../lib/types";
import { getSourceFile } from "../lib/file-context";
import { asBollDirectory } from "../lib/boll-directory";
import { Package } from "../lib/package";

export const test = baretest("ESLint Prefer Const");

test("Should succeed because prefer-const rule is set to 'error'", () => {
  inFixtureDir("configs/eslint/prefer-const", async () => {
    const eslintRules = new ESLintRules();
    const sut = new ESLintPreferConstRule();
    const results = await sut.check(
      await getSourceFile(asBollDirectory("."), "prefer-const.ts", new Package({}), eslintRules)
    );
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].status, ResultStatus.success);
  });
});

test("Should fail because prefer-const rule is set to 'off'", () => {
  inFixtureDir("configs/eslint/prefer-const/prefer-const-off", async () => {
    const eslintRules = new ESLintRules();
    const sut = new ESLintPreferConstRule();
    const results = await sut.check(
      await getSourceFile(asBollDirectory("."), "prefer-const-off.ts", new Package({}), eslintRules)
    );
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].status, ResultStatus.failure);
    assert.strictEqual(
      results[0].formattedMessage.includes(`prefer-const rule exists but at level "off" instead of "error"`),
      true
    );
  });
});
