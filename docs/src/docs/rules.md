# Rules

## Per-package rules

- [NoRedundantDeps](../api/rules-core/classes/noredundantdepsrule)
  Ensure that dependencies are not declared in both `dependencies` and `peerDependencies`
- [EnforceRationale](../api/rules-core/classes/enforcerationalerule)
  Ensure that specified fields in JSON files have an entry in a `rationale` field in the same file explaining the addition.
- [ESLintPreferConstRule](../api/rules-external-tools/classes/eslintpreferconstrule)
  Esnure that the prefer-const ESLint rule is enabled

## Per-source file rules

- [CrossPackageDependencyDetector](../api/rules-typescript/classes/crosspackagedependencydetector)
  Find usage of imports across package boundaries
- [NodeModulesReferenceDetector](../api/rules-typescript/classes/nodemodulesreferencedetector)
  Catch errant usages of `node_modules` (instead of proper imports)
- [RedundantImportsDetector](../api/rules-typescript/classes/redundantimportsdetector)
  Find redunant imports
- [SrcDetector](../api/rules-typescript/classes/srcdetector)
  Catch usage of `src` in import paths, a clue that things are not being imported correctly.
- [TransitiveDependencyDetector](../api/rules-typescript/classes/transitivedependencydetector)
  Find usage of dependencies of dependencies.
