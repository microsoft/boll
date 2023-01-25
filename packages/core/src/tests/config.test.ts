import * as assert from "assert";
import baretest from "baretest";
import { BollFile } from "../boll-file";
import { Config } from "../config";
import { ConfigRegistry } from "../config-registry";
import { FileGlob, PackageRule, RuleSetConfiguration, CheckFunctionOptions } from "../types";
import { NullLogger } from "../logger";
import { Result } from "../result-set";
import { RuleRegistry, addRule } from "../rule-registry";

export const test: any = baretest("Config");

class FakeRule implements PackageRule {
  name: string = "fakerule";

  constructor(public options: {} = {}) {}

  async check(file: any): Promise<Result[]> {
    throw new Error("Method not implemented.");
  }
}

class FakeGlob implements FileGlob {
  findFiles(): Promise<BollFile[]> {
    throw new Error("Method not implemented.");
  }
  exclude: string[] = [];
  include: string[] = [];
}

test("should allow multi-level inheritance of configs", () => {
  const configRegistry = new ConfigRegistry();
  const ruleRegistry = new RuleRegistry();
  let called = false;
  ruleRegistry.register("foo", () => {
    called = true;
    return new FakeRule();
  });
  configRegistry.register({
    name: "base",
    ruleSets: [{ fileLocator: new FakeGlob(), checks: { file: [{ rule: "foo" }] } }]
  });
  configRegistry.register({ name: "level1", extends: "base" });
  configRegistry.register({ name: "level2", extends: "level1" });
  configRegistry.register({ name: "level3", extends: "level2" });
  const config = new Config(configRegistry, ruleRegistry, NullLogger);
  config.load({ extends: "level3" });
  config.buildSuite();
  assert.ok(called, "Rule factory should have been invoked when creating suite.");
});

test("should apply exclude/include across extended config", async () => {
  const configRegistry = new ConfigRegistry();
  const ruleSets: RuleSetConfiguration[] = [{ exclude: ["testme"], fileLocator: new FakeGlob() }];
  configRegistry.register({ name: "base", ruleSets });
  const config = new Config(configRegistry, new RuleRegistry(), NullLogger);
  config.load({ extends: "base" });
  const suite = await config.buildSuite();
  assert.deepStrictEqual(suite.ruleSets[0].fileGlob.exclude, ["testme"]);
});

test("gives options to factory function", () => {
  const configRegistry = new ConfigRegistry();
  const ruleRegistry = new RuleRegistry();
  let calledWithCorrectArgs = false;
  ruleRegistry.register("foo", (l: any, options: any) => {
    if (options && options.bar === "baz") {
      calledWithCorrectArgs = true;
    }
    return new FakeRule();
  });
  const config = new Config(configRegistry, ruleRegistry, NullLogger);
  config.load({
    ruleSets: [{ fileLocator: new FakeGlob(), checks: { file: [{ rule: "foo", options: { bar: "baz" } }] } }]
  });
  config.buildSuite();
  assert.ok(calledWithCorrectArgs, "Rule factory should have been invoked with correct args when creating suite.");
});

test("addRule function can register and pass options", async () => {
  const configRegistry = new ConfigRegistry();
  const ruleRegistry = new RuleRegistry();

  addRule<PackageRule>(
    {
      name: "foo",
      check: async (filename: any) => {
        const results: Result[] = [];

        return results;
      }
    },
    ruleRegistry
  );

  const config = new Config(configRegistry, ruleRegistry, NullLogger);
  config.load({
    ruleSets: [{ fileLocator: new FakeGlob(), checks: { file: [{ rule: "foo", options: { bar: "baz" } }] } }]
  });
  const { ruleSets } = await config.buildSuite();

  assert.ok(
    ruleSets[0].fileChecks[0].options?.bar,
    "addRule should have been invoked with correct args when creating suite."
  );
});

test("downstream rules configuration applies to rules", async () => {
  const configRegistry = new ConfigRegistry();
  configRegistry.register({
    name: "base",
    ruleSets: [{ fileLocator: new FakeGlob(), checks: { file: [{ rule: "foo", options: { bar: "baz" } }] } }]
  });
  const ruleRegistry = new RuleRegistry();
  ruleRegistry.register("foo", (l: any, options: any) => {
    return new FakeRule(options);
  });
  const config = new Config(configRegistry, ruleRegistry, NullLogger);
  const myConfig = {
    extends: "base",
    configuration: {
      rules: {
        foo: { some: "rule" }
      }
    }
  };
  config.load(myConfig);
  const suite = await config.buildSuite();
  const fakeRuleInstance = suite.ruleSets[0].fileChecks[0].rule as FakeRule;
  assert.deepStrictEqual(fakeRuleInstance.options, { bar: "baz", some: "rule" });
});

test("downstream ruleSet configuration applies to ruleSets", async () => {
  const configRegistry = new ConfigRegistry();
  configRegistry.register({
    name: "base",
    ruleSets: [{ fileLocator: new FakeGlob(), name: "fake", exclude: ["bar"] }],
    exclude: ["baz"]
  });

  const config = new Config(configRegistry, new RuleRegistry(), NullLogger);
  const myConfig = {
    extends: "base",
    exclude: ["foo2"],
    configuration: {
      ruleSets: {
        fake: {
          exclude: ["foo"]
        }
      }
    }
  };
  config.load(myConfig);
  const suite = await config.buildSuite();
  const ruleSet = suite.ruleSets[0];
  assert.deepStrictEqual(ruleSet.fileGlob.exclude, ["bar", "foo2", "baz", "foo"]);
});

test("resolveConfiguration merges exclude", () => {
  const configRegistry = new ConfigRegistry();
  configRegistry.register({
    name: "base",
    exclude: ["baz"]
  });
  configRegistry.register({
    name: "child",
    exclude: ["foo"],
    extends: "base"
  });
  const config = new Config(configRegistry, new RuleRegistry(), NullLogger);
  config.load({ extends: "child" });
  const result = config.resolvedConfiguration();
  assert.deepStrictEqual(result.exclude, ["baz", "foo"]);
});
