import { Suite } from "./suite";

export class Config {
  buildSuite(): Suite {
    return new Suite();
  }
  load(def: ConfigDefinition) {}
}

export interface CheckConfiguration {
  rule: string;
  options?: {};
}

export interface ConfigDefinition {
  checks?: CheckConfiguration[];
  extends?: string;
}

export const RecommendedConfig: ConfigDefinition = {
  checks: [
    { rule: "SrcDetector" },
    { rule: "CrossPackageDependencyDetector" },
    { rule: "TransitiveDependencyDetector" },
  ],
};
