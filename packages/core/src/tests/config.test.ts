import * as assert from "assert";
import baretest from "baretest";
import { Config } from "../config";
import { ConfigRegistry } from "../config-registry";
import { Result } from "../result-set";
import { RuleRegistry } from "../rule-registry";
import { Rule } from "../types";

export const test: any = baretest("Config");

class FakeRule implements Rule {
  name: string = "fakerule";
  check(file: any): Result[] {
    throw new Error("Method not implemented.");
  }
}

test("should allow multi-level inheritance of configs", () => {
  const configRegistry = new ConfigRegistry();
  const ruleRegistry = new RuleRegistry();
  let called = false;
  ruleRegistry.register("foo", () => {
    called = true;
    return new FakeRule();
  });
  configRegistry.register({ name: "base", checks: [{ rule: "foo" }] });
  configRegistry.register({ name: "level1", extends: "base" });
  configRegistry.register({ name: "level2", extends: "level1" });
  configRegistry.register({ name: "level3", extends: "level2" });
  const config = new Config(configRegistry, ruleRegistry);
  config.load({ extends: "level3" });
  config.buildSuite();
  assert.ok(called, "Rule factory should have been invoked when creating suite.");
});

test("should apply exclude/include across extended config", () => {
  const configRegistry = new ConfigRegistry();
  configRegistry.register({ name: "base", exclude: ["testme"] });
  const config = new Config(configRegistry, new RuleRegistry());
  config.load({ extends: "base" });
  const suite = config.buildSuite();
  assert.deepEqual(suite.fileGlob.exclude, ["testme"]);
});
