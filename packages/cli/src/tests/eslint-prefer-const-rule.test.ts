import * as assert from "assert";
import baretest from "baretest";
import { asBollFile } from "../lib/boll-file";
import { ESLintRules } from "../lib/eslint-rules";
import { inFixtureDir } from "./test-helper";
import { ESLintPreferConstRule } from "../rules/eslint-prefer-const-rule";
import { ResultStatus } from "../lib/types";

export const test = baretest("ESLint Rules");

test("", () => {
  inFixtureDir("configs/eslint/prefer-const", async () => {
    const eslintRules = new ESLintRules();
    const config = await eslintRules.getSourceFileConfig(asBollFile("foo.ts"));
    const sut = new ESLintPreferConstRule();
    const results = sut.check({ ...config, filename: "foo.ts" });
    assert.equal(results.length, 1);
    assert.equal(results[0].status, ResultStatus.success);
  });
});

test("", () => {
  inFixtureDir("configs/eslint/prefer-const/prefer-const-off", async () => {
    const eslintRules = new ESLintRules();
    const config = await eslintRules.getSourceFileConfig(asBollFile("foo.ts"));
    const sut = new ESLintPreferConstRule();
    const results = sut.check({ ...config, filename: "foo.ts" });
    assert.equal(results.length, 1);
    assert.equal(results[0].status, ResultStatus.failure);
    assert.equal(
      results[0].formattedMessage.includes(`prefer-const rule exists but at level "off" instead of "error"`),
      true
    );
  });
});
