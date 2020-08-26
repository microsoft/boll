import * as assert from "assert";
import baretest from "baretest";
import { Config } from "../lib/config";
import { RecommendedConfig } from "../config/recommended";
import { RuleRegistryInstance } from "../lib/rule-registry";
import { ConfigRegistryInstance } from "../lib/config-registry";
import { bootstrapConfigurations } from "../config/bootstrap";

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
