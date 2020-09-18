import { ConfigDefinition, ConfigRegistryInstance, Logger, RuleRegistryInstance } from "@boll/core";
import {
  CrossPackageDependencyDetector,
  NodeModulesReferenceDetector,
  RedundantImportsDetector,
  SrcDetector,
  TransitiveDependencyDetector
} from "@boll/rules-typescript";
import { ESLintPreferConstRule } from "@boll/rules-external-tools";

let bootstrapRun = false;
export const bootstrapRecommendedConfiguration = () => {
  if (bootstrapRun) return;
  RuleRegistryInstance.register("SrcDetector", () => new SrcDetector());
  RuleRegistryInstance.register("CrossPackageDependencyDetector", () => new CrossPackageDependencyDetector());
  RuleRegistryInstance.register("TransitiveDependencyDetector", () => new TransitiveDependencyDetector());
  RuleRegistryInstance.register("NodeModulesReferenceDetector", () => new NodeModulesReferenceDetector());
  RuleRegistryInstance.register("RedundantImportsDetector", () => new RedundantImportsDetector());
  RuleRegistryInstance.register("ESLintPreferConstRule", (l: Logger) => new ESLintPreferConstRule(l));
  ConfigRegistryInstance.register(RecommendedConfig);
  bootstrapRun = true;
};

export const RecommendedConfig: ConfigDefinition = {
  name: "boll:recommended",
  checks: [
    { rule: "SrcDetector" },
    { rule: "CrossPackageDependencyDetector" },
    { rule: "TransitiveDependencyDetector" },
    { rule: "NodeModulesReferenceDetector" },
    { rule: "RedundantImportsDetector" }
  ]
};
