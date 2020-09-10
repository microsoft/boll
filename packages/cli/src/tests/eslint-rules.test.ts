import * as assert from "assert";
import baretest from "baretest";
import { asBollFile } from "../lib/boll-file";
import { ESLintRules } from "../lib/eslint-rules";
import { inFixtureDir } from "./test-helper";

export const test = baretest("ESLint Rules");

test("Correctly parses the config for a ts file in the same directory as the ESLint config", () => {
  inFixtureDir("configs/eslint", async () => {
    const sut = new ESLintRules();
    const config = await sut.getSourceFileConfig(asBollFile("foo.ts"));
    assert.ok(config.rules);
    assert.deepEqual(config.rules, { "rule-one": ["error"], "rule-two": ["warn"], "rule-three": ["off"] });
    assert.ok(config.env);
    assert.deepEqual(config.env, { browser: true, node: false });
  });
});

test("Correctly parses both configs for a ts file in a nested directory with its own ESLint config", () => {
  inFixtureDir("configs/eslint/foo", async () => {
    const sut = new ESLintRules();
    const config = await sut.getSourceFileConfig(asBollFile("bar.ts"));
    assert.ok(config.rules);
    assert.deepEqual(config.rules, {
      "rule-one": ["error"],
      "rule-two": ["error"],
      "rule-three": ["off"],
      "rule-four": ["warn"],
    });
    assert.ok(config.env);
    assert.deepEqual(config.env, { browser: true, node: false, es6: true });
  });
});
