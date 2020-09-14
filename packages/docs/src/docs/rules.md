# Rules

## Per-source file rules

- [CrossPackageDependencyDetector](../api/classes/crosspackagedependencydetector)
  Find usage of imports across package boundaries
- [NodeModulesReferenceDetector](../api/classes/nodemodulesreferencedetector)
  Catch errant usages of `node_modules` (instead of proper imports)
- [RedundantImportsDetector](../api/classes/redundantimportsdetector)
  Find redunant imports
- [SrcDetector](../api/classes/srcdetector)
  Catch usage of `src` in import paths, a clue that things are not being imported correctly.
- [TransitiveDependencyDetector](../api/classes/transitivedependencydetector)
  Find usage of dependencies of dependencies.
