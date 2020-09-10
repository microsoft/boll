import { RecommendedConfig } from "./recommended";
import { ConfigRegistryInstance } from "../lib/config-registry";
import { CrossPackageDependencyDetector } from "../rules/cross-package-dependency-detector";
import { NodeModulesReferenceDetector } from "../rules/node-modules-reference-detector";
import { RedundantImportsDetector } from "../rules/redundant-imports-detector";
import { RuleRegistryInstance } from "../lib/rule-registry";
import { SrcDetector } from "../rules/src-detector";
import { TransitiveDependencyDetector } from "../rules/transitive-dependency-detector";
import { ESLintPreferConstRule } from "../rules/eslint-prefer-const-rule";

let bootstrapRun = false;
export const bootstrapConfigurations = () => {
  if (bootstrapRun) return;
  RuleRegistryInstance.register("SrcDetector", () => new SrcDetector());
  RuleRegistryInstance.register("CrossPackageDependencyDetector", () => new CrossPackageDependencyDetector());
  RuleRegistryInstance.register("TransitiveDependencyDetector", () => new TransitiveDependencyDetector());
  RuleRegistryInstance.register("NodeModulesReferenceDetector", () => new NodeModulesReferenceDetector());
  RuleRegistryInstance.register("RedundantImportsDetector", () => new RedundantImportsDetector());
  RuleRegistryInstance.register("ESLintPreferConstRule", () => new ESLintPreferConstRule());

  ConfigRegistryInstance.register(RecommendedConfig);
  bootstrapRun = true;
};
