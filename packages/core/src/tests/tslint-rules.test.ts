import * as assert from "assert";
import baretest from "baretest";
import { IOptions } from "tslint/lib/language/rule/rule";
import { inFixtureDir, tempRename } from "./test-helper";
import { TSLintRules } from "../tslint-rules";
import { asBollFile } from "../boll-file";
export const test: any = baretest("TSLint Rules");

const expectedJSONRules: { [key: string]: Partial<IOptions> } = {
  "rule-one": {
    ruleSeverity: "error",
    ruleArguments: [1, 2, 3]
  },
  "rule-two": {
    ruleSeverity: "off",
    ruleArguments: undefined
  },
  "rule-three": {
    ruleSeverity: "error",
    ruleArguments: ["test"]
  },
  "rule-four": {
    ruleSeverity: "warning",
    ruleArguments: undefined
  }
};
const expectedJSONJsRules: { [key: string]: Partial<IOptions> } = {
  "rule-one": {
    ruleSeverity: "error",
    ruleArguments: []
  },
  "rule-two": {
    ruleSeverity: "warning",
    ruleArguments: ["test"]
  }
};

const expectedYAMLRules: { [key: string]: Partial<IOptions> } = {
  "rule-two": {
    ruleSeverity: "warning",
    ruleArguments: [1, 2, 3]
  },
  "rule-five": {
    ruleSeverity: "off",
    ruleArguments: ["test"]
  }
};
const expectedYAMLJsRules: { [key: string]: Partial<IOptions> } = {
  "rule-two": {
    ruleSeverity: "off",
    ruleArguments: ["test"]
  },
  "rule-three": {
    ruleSeverity: "error",
    ruleArguments: undefined
  }
};

test("Correctly parses the config for a ts file in the same directory as the TSLint config", async () => {
  await inFixtureDir("tslint", async () => {
    const sut = new TSLintRules();
    const config = sut.getSourceFileConfig(asBollFile("foo.ts"));
    const rules = new Map<string, Partial<IOptions>>(Object.entries(expectedJSONRules));
    const jsRules = new Map<string, Partial<IOptions>>(Object.entries(expectedJSONJsRules));
    assert.ok(config.results);
    assert.deepStrictEqual(config.results, {
      rules,
      jsRules,
      extends: [],
      linterOptions: {},
      rulesDirectory: []
    });
  });
});

test("Correctly parses both configs for a ts file in a nested directory without its own TSLint config", async () => {
  await inFixtureDir("tslint/foo", async () => {
    const sut = new TSLintRules();
    const config = sut.getSourceFileConfig(asBollFile("bar.ts"));
    const rules = new Map<string, Partial<IOptions>>(Object.entries(expectedJSONRules));
    const jsRules = new Map<string, Partial<IOptions>>(Object.entries(expectedJSONJsRules));
    assert.ok(config.results);
    assert.deepStrictEqual(config.results, {
      rules,
      jsRules,
      extends: [],
      linterOptions: {},
      rulesDirectory: []
    });
  });
});

test("Correctly parses a YAML config when a JSON config cannot be found", async () => {
  await inFixtureDir("tslint", async () => {
    await tempRename(asBollFile("tslint.json"), "not-tslint.json", async () => {
      const sut = new TSLintRules();
      const config = sut.getSourceFileConfig(asBollFile("bar.ts"));
      const rules = new Map<string, Partial<IOptions>>(Object.entries(expectedYAMLRules));
      const jsRules = new Map<string, Partial<IOptions>>(Object.entries(expectedYAMLJsRules));
      assert.ok(config.results);
      assert.deepStrictEqual(config.results, {
        rules,
        jsRules,
        extends: [],
        linterOptions: {},
        rulesDirectory: []
      });
    });
  });
});
