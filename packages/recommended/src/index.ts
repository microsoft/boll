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
<<<<<<< HEAD
import { NoAddRootResolutions, NoRedundantDepsRule } from "@boll/rules-core";
=======
import { NoRedundantDepsRule } from "@boll/rules-core";
>>>>>>> main

let bootstrapRun = false;
export const bootstrapRecommendedConfiguration = () => {
  if (bootstrapRun) return;
  RuleRegistryInstance.register("SrcDetector", () => new SrcDetector());
  RuleRegistryInstance.register("CrossPackageDependencyDetector", () => new CrossPackageDependencyDetector());
  RuleRegistryInstance.register("TransitiveDependencyDetector", () => new TransitiveDependencyDetector());
  RuleRegistryInstance.register("NodeModulesReferenceDetector", () => new NodeModulesReferenceDetector());
  RuleRegistryInstance.register("RedundantImportsDetector", () => new RedundantImportsDetector());
  RuleRegistryInstance.register("ESLintPreferConstRule", (l: Logger) => new ESLintPreferConstRule(l));
  RuleRegistryInstance.register("NoRedundantDepsRule", (l: Logger) => new NoRedundantDepsRule(l));
<<<<<<< HEAD
  RuleRegistryInstance.register("NoAddRootResolutions", () => new NoAddRootResolutions());
=======
>>>>>>> main
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
