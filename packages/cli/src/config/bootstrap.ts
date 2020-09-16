import { RecommendedConfig } from "./recommended";
import { CrossPackageDependencyDetector } from "../rules/cross-package-dependency-detector";
import { NodeModulesReferenceDetector } from "../rules/node-modules-reference-detector";
import { RedundantImportsDetector } from "../rules/redundant-imports-detector";
import { SrcDetector } from "../rules/src-detector";
import { TransitiveDependencyDetector } from "../rules/transitive-dependency-detector";
import { TSLintNoNamespaceRule } from "../rules/tslint-no-namespace-rule";
import { ConfigRegistryInstance, RuleRegistryInstance } from "@boll/core";

let bootstrapRun = false;
export const bootstrapConfigurations = () => {
  if (bootstrapRun) return;
  RuleRegistryInstance.register("SrcDetector", () => new SrcDetector());
  RuleRegistryInstance.register("CrossPackageDependencyDetector", () => new CrossPackageDependencyDetector());
  RuleRegistryInstance.register("TransitiveDependencyDetector", () => new TransitiveDependencyDetector());
  RuleRegistryInstance.register("NodeModulesReferenceDetector", () => new NodeModulesReferenceDetector());
  RuleRegistryInstance.register("RedundantImportsDetector", () => new RedundantImportsDetector());
  RuleRegistryInstance.register("TSLintNoNamespaceRule", () => new TSLintNoNamespaceRule());

  ConfigRegistryInstance.register(RecommendedConfig);
  bootstrapRun = true;
};
