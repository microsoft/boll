import * as assert from "assert";
import baretest from "baretest";
import * as path from "path";
import { ConfigRuleBase } from "../lib/config-rule-base";
import { inFixtureDir } from "./test-helper";
import { EslintRuleBase } from "../lib/eslint-rule-base";

export const test = baretest("Eslint Rule Base");

test("should correctly parse JS config", async () => {
  await inFixtureDir("configs", async () => {
    const sut = new EslintRuleBase();
  });
});
