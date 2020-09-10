import { ConfigDefinition } from "../lib/types";

export const RecommendedConfig: ConfigDefinition = {
  name: "boll:recommended",
  checks: [
    { rule: "SrcDetector" },
    { rule: "CrossPackageDependencyDetector" },
    { rule: "TransitiveDependencyDetector" },
    { rule: "NodeModulesReferenceDetector" },
    { rule: "RedundantImportsDetector" },
    { rule: "ESLintPreferConstRule" },
  ],
  eslintOptions: {
    resolvePluginsRelativeTo: "./packages/eslint-plugin-office-online-rules",
  },
};
