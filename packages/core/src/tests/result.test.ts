import * as assert from "assert";
import baretest from "baretest";
import { Config } from "../config";
import { ConfigRegistry } from "../config-registry";
import { CheckConfiguration, PackageRule } from "../types";
import { NullLogger } from "../logger";
import { Result } from "../result-set";
import { RuleRegistry } from "../rule-registry";
import { Failure } from "../result-set";
import { asBollLineNumber } from "../boll-line-number";
import { inFixtureDir } from "@boll/test-internal";
import { TypescriptSourceGlob } from "../glob";
import { FileContext } from "../file-context";

export const test: any = baretest("Suite result");

class FakeFile {}

class FakeRule implements PackageRule {
  name: string = "fakerule";

  constructor(public options: {} = {}) {}

  async check(file: FileContext): Promise<Result[]> {
    return [new Failure(this.name, file.filename, asBollLineNumber(0), "Something went wrong.")];
  }
}

class FakeRule2 implements PackageRule {
  name: string = "fakerule2";

  constructor(public options: {} = {}) {}

  async check(file: FileContext): Promise<Result[]> {
    return [new Failure(this.name, file.filename, asBollLineNumber(0), "Something went wrong.")];
  }
}

test("should log a failure as an error by default", async () => {
  await inFixtureDir("project-a", __dirname, async () => {
    const ruleRegistry = new RuleRegistry();
    ruleRegistry.register("foo", (l: any, options: any) => {
      return new FakeRule(options);
    });
    const config = new Config(new ConfigRegistry(), ruleRegistry, NullLogger);
    const myConfig = {
      ruleSets: [
        { fileLocator: new TypescriptSourceGlob(), checks: { file: [{ rule: "foo", options: { bar: "baz" } }] } }
      ],
      configuration: {
        rules: {
          foo: { some: "rule" }
        }
      }
    };
    config.load(myConfig);
    const suite = await config.buildSuite();
    const results = await suite.run(NullLogger);
    assert.strictEqual(results.warnings.length, 0);
    assert.strictEqual(results.errors.length, 2);
  });
});

test("should log a failure as a warning if configured in the rule", async () => {
  await inFixtureDir("project-a", __dirname, async () => {
    const ruleRegistry = new RuleRegistry();
    ruleRegistry.register("foo", (l: any, options: any) => {
      return new FakeRule(options);
    });
    const config = new Config(new ConfigRegistry(), ruleRegistry, NullLogger);
    const myConfig = {
      ruleSets: [
        {
          fileLocator: new TypescriptSourceGlob(),
          checks: { file: [{ severity: "warn", rule: "foo", options: { bar: "baz" } } as CheckConfiguration] }
        }
      ],
      configuration: {
        rules: {
          foo: { some: "rule" }
        }
      }
    };
    config.load(myConfig);
    const suite = await config.buildSuite();
    const results = await suite.run(NullLogger);
    assert.strictEqual(results.errors.length, 0);
    assert.strictEqual(results.warnings.length, 2);
  });
});

test("should group results by rule name", async () => {
  await inFixtureDir("project-a", __dirname, async () => {
    const ruleRegistry = new RuleRegistry();
    ruleRegistry.register("foo", (l: any, options: any) => {
      return new FakeRule(options);
    });
    ruleRegistry.register("bar", (l: any, options: any) => {
      return new FakeRule2(options);
    });

    const config = new Config(new ConfigRegistry(), ruleRegistry, NullLogger);
    const myConfig = {
      ruleSets: [
        {
          fileLocator: new TypescriptSourceGlob(),
          checks: {
            file: [
              { severity: "warn", rule: "foo", options: { bar: "baz" } } as CheckConfiguration,
              { severity: "error", rule: "bar", options: { bar: "baz" } } as CheckConfiguration
            ]
          }
        }
      ],
      configuration: {
        rules: {
          foo: { some: "rule" }
        }
      }
    };
    config.load(myConfig);
    const suite = await config.buildSuite();
    const results = await suite.run(NullLogger);
    const groupedByRuleNameResults = results.getResultsByRule();
    assert.ok(groupedByRuleNameResults["fakerule"]);
    assert.ok(groupedByRuleNameResults["fakerule2"]);
    assert.strictEqual(groupedByRuleNameResults["fakerule"].errors.length, 0);
    assert.strictEqual(groupedByRuleNameResults["fakerule"].warnings.length, 2);
    assert.strictEqual(groupedByRuleNameResults["fakerule2"].errors.length, 2);
    assert.strictEqual(groupedByRuleNameResults["fakerule2"].warnings.length, 0);
  });
});

test("should group results by rule name and accumulate results", async () => {
  await inFixtureDir("project-a", __dirname, async () => {
    const ruleRegistry = new RuleRegistry();
    ruleRegistry.register("foo", (l: any, options: any) => {
      return new FakeRule(options);
    });
    ruleRegistry.register("bar", (l: any, options: any) => {
      return new FakeRule(options);
    });
    const config = new Config(new ConfigRegistry(), ruleRegistry, NullLogger);
    const myConfig = {
      ruleSets: [
        {
          fileLocator: new TypescriptSourceGlob(),
          checks: {
            file: [
              { severity: "warn", rule: "foo", options: { bar: "baz" } } as CheckConfiguration,
              { severity: "warn", rule: "bar", options: { bar: "baz" } } as CheckConfiguration
            ]
          }
        }
      ],
      configuration: {
        rules: {
          foo: { some: "rule" }
        }
      }
    };
    config.load(myConfig);
    const suite = await config.buildSuite();
    const results = await suite.run(NullLogger);
    const groupedByRuleNameResults = results.getResultsByRule();
    assert.strictEqual(groupedByRuleNameResults["fakerule"].errors.length, 0);
    assert.strictEqual(groupedByRuleNameResults["fakerule"].warnings.length, 4);
  });
});

test("should group results by registry", async () => {
  await inFixtureDir("project-a", __dirname, async () => {
    const ruleRegistry = new RuleRegistry();
    ruleRegistry.register("foo", (l: any, options: any) => {
      return new FakeRule(options);
    });
    ruleRegistry.register("fooz", (l: any, options: any) => {
      return new FakeRule2(options);
    });

    const config = new Config(new ConfigRegistry(), ruleRegistry, NullLogger);
    const myConfig = {
      ruleSets: [
        {
          fileLocator: new TypescriptSourceGlob(),
          checks: {
            file: [
              { severity: "error", rule: "foo", options: { bar: "baz" } } as CheckConfiguration,
              { severity: "warn", rule: "fooz", options: { bar: "baz" } } as CheckConfiguration
            ]
          }
        }
      ],
      configuration: {
        rules: {
          foo: { some: "rule" }
        }
      }
    };
    config.load(myConfig);
    const suite = await config.buildSuite();
    const results = await suite.run(NullLogger);
    const groupedByRuleNameRegistry = results.getResultsByRegistry();
    assert.ok(groupedByRuleNameRegistry["foo"]);
    assert.ok(groupedByRuleNameRegistry["fooz"]);
    assert.strictEqual(groupedByRuleNameRegistry["foo"].errors.length, 2);
    assert.strictEqual(groupedByRuleNameRegistry["foo"].warnings.length, 0);
    assert.strictEqual(groupedByRuleNameRegistry["fooz"].errors.length, 0);
    assert.strictEqual(groupedByRuleNameRegistry["fooz"].warnings.length, 2);
  });
});
