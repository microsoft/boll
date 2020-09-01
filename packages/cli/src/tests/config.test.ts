import * as assert from "assert";
import baretest from "baretest";
import { bootstrapConfigurations } from "../config/bootstrap";
import { Config } from "../lib/config";
import { ConfigRegistry, ConfigRegistryInstance } from "../lib/config-registry";
import { RecommendedConfig } from "../config/recommended";
import { RuleRegistry, RuleRegistryInstance } from "../lib/rule-registry";
import { SrcDetector } from "../rules/src-detector";

export const test = baretest("Config");

test.before(() => {
  bootstrapConfigurations();
});

test("should load default suite when extended from recommended", async () => {
  const sut = new Config(ConfigRegistryInstance, RuleRegistryInstance);
  sut.load({
    extends: "boll:recommended",
  });
  const suite = sut.buildSuite();
  assert.equal(suite.checks.length, RecommendedConfig.checks!.length);
});

test("should create suite with 1 check when directed", async () => {
  const sut = new Config(ConfigRegistryInstance, RuleRegistryInstance);
  sut.load({ checks: [{ rule: "SrcDetector" }] });
  const suite = sut.buildSuite();
  assert.equal(suite.checks.length, 1);
});

test("should allow multi-level inheritance of configs", () => {
  const configRegistry = new ConfigRegistry();
  const ruleRegistry = new RuleRegistry();
  let called = false;
  ruleRegistry.register("foo", () => {
    called = true;
    return new SrcDetector();
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
