import { ConfigDefinition, ConfigRegistryInstance, RuleRegistryInstance } from "@boll/core";
import {
  CrossPackageDependencyDetector,
  NodeModulesReferenceDetector,
  RedundantImportsDetector,
  SrcDetector,
  TransitiveDependencyDetector
} from "@boll/rules-typescript";

let bootstrapRun = false;
export const bootstrapRecommendedConfiguration = () => {
  if (bootstrapRun) return;
  RuleRegistryInstance.register("SrcDetector", () => new SrcDetector());
  RuleRegistryInstance.register("CrossPackageDependencyDetector", () => new CrossPackageDependencyDetector());
  RuleRegistryInstance.register("TransitiveDependencyDetector", () => new TransitiveDependencyDetector());
  RuleRegistryInstance.register("NodeModulesReferenceDetector", () => new NodeModulesReferenceDetector());
  RuleRegistryInstance.register("RedundantImportsDetector", () => new RedundantImportsDetector());
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
