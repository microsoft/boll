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

test("should log a failure as an error by default", async () => {
  await inFixtureDir("project-a", __dirname, async () => {
    const ruleRegistry = new RuleRegistry();
    ruleRegistry.register("foo", (l: any, options: any) => {
      return new FakeRule(options);
    });
    const config = new Config(new ConfigRegistry(), ruleRegistry, NullLogger);
    const myConfig = {
      ruleSets: [{ fileLocator: new TypescriptSourceGlob(), checks: [{ rule: "foo", options: { bar: "baz" } }] }],
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
          checks: [{ severity: "warn", rule: "foo", options: { bar: "baz" } } as CheckConfiguration]
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
