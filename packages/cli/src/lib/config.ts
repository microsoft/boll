import { Suite } from "./suite";

export class Config {
  buildSuite(): Suite {
    throw new Error("Method not implemented.");
  }
  load(def: ConfigDefinition) {
    throw new Error("Method not implemented.");
  }
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
