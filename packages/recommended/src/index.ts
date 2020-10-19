import {
  ConfigDefinition,
  ConfigRegistryInstance,
  Logger,
  PackageJsonGlob,
  RuleRegistryInstance,
  TypescriptSourceGlob
} from "@boll/core";
import {
  CrossPackageDependencyDetector,
  NodeModulesReferenceDetector,
  RedundantImportsDetector,
  SrcDetector,
  TransitiveDependencyDetector
} from "@boll/rules-typescript";
import { ESLintPreferConstRule } from "@boll/rules-external-tools";
import { EnforceRationale, EnforceRationaleOptions, NoRedundantDepsRule } from "@boll/rules-core";

let bootstrapRun = false;
export const bootstrapRecommendedConfiguration = () => {
  if (bootstrapRun) return;

  // TypeScript rules
  RuleRegistryInstance.register("CrossPackageDependencyDetector", () => new CrossPackageDependencyDetector());
  RuleRegistryInstance.register("NodeModulesReferenceDetector", () => new NodeModulesReferenceDetector());
  RuleRegistryInstance.register("RedundantImportsDetector", () => new RedundantImportsDetector());
  RuleRegistryInstance.register("SrcDetector", () => new SrcDetector());
  RuleRegistryInstance.register("TransitiveDependencyDetector", () => new TransitiveDependencyDetector());

  // External tools rules
  RuleRegistryInstance.register("ESLintPreferConstRule", (l: Logger) => new ESLintPreferConstRule(l));

  // Core rules
  RuleRegistryInstance.register("NoRedundantDepsRule", (l: Logger) => new NoRedundantDepsRule(l));
  RuleRegistryInstance.register("EnforceRationale", () => new EnforceRationale());

  ConfigRegistryInstance.register(RecommendedConfig);
  bootstrapRun = true;
};

export const RecommendedConfig: ConfigDefinition = {
  name: "boll:recommended",
  ruleSets: [
    {
      fileLocator: new TypescriptSourceGlob(),
      checks: [
        { rule: "SrcDetector" },
        { rule: "CrossPackageDependencyDetector" },
        { rule: "TransitiveDependencyDetector" },
        { rule: "NodeModulesReferenceDetector" },
        { rule: "RedundantImportsDetector" }
      ]
    },
    {
      fileLocator: new PackageJsonGlob(),
      checks: [{ rule: "NoRedundantDepsRule" }]
    }
  ]
};
