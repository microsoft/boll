import { RecommendedConfig } from "./recommended";
import { ConfigRegistryInstance } from "../lib/config-registry";
import { CrossPackageDependencyDetector } from "../rules/cross-package-dependency-detector";
import { RuleRegistryInstance } from "../lib/rule-registry";
import { SrcDetector } from "../rules/src-detector";
import { TransitiveDependencyDetector } from "../rules/transitive-dependency-detector";

let bootstrapRun = false;
export const bootstrapConfigurations = () => {
  if (bootstrapRun) return;
  RuleRegistryInstance.register("SrcDetector", () => new SrcDetector());
  RuleRegistryInstance.register(
    "CrossPackageDependencyDetector",
    () => new CrossPackageDependencyDetector()
  );
  RuleRegistryInstance.register(
    "TransitiveDependencyDetector",
    () => new TransitiveDependencyDetector()
  );
  ConfigRegistryInstance.register(RecommendedConfig);
  bootstrapRun = true;
};
