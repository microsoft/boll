import fs from "fs";
import path from "path";
import { asBollDirectory } from "./boll-directory";
import { FileGlob, Rule, ConfigDefinition } from "./types";
import { getSourceFile } from "./file-context";
import { Logger } from "./logger";
import { Package } from "./package";
import { ResultSet } from "./result-set";
import { TypescriptSourceGlob } from "./glob";
import { CrossPackageDependencyDetector } from "../rules/cross-package-dependency-detector";
import { NodeModulesReferenceDetector } from "../rules/node-modules-reference-detector";
import { RedundantImportsDetector } from "../rules/redundant-imports-detector";
import { SrcDetector } from "../rules/src-detector";
import { TransitiveDependencyDetector } from "../rules/transitive-dependency-detector";
import { promisify } from "util";
import { ESLintRules } from "./eslint-rules";
import { ESLintPreferConstRule } from "../rules/eslint-prefer-const-rule";
const readFileAsync = promisify(fs.readFile);

export class Suite {
  private _hasRun = false;
  public fileGlob: FileGlob = new TypescriptSourceGlob();

  public checks: Rule[] = [
    new SrcDetector(),
    new TransitiveDependencyDetector(),
    new CrossPackageDependencyDetector(),
    new RedundantImportsDetector(),
    new NodeModulesReferenceDetector(),
    new ESLintPreferConstRule(),
  ];

  constructor(private config: ConfigDefinition) {}

  get hasRun(): boolean {
    return this._hasRun;
  }

  async run(logger: Logger): Promise<ResultSet> {
    this._hasRun = true;

    const resultSet = new ResultSet();
    const packageContext = await this.loadPackage(logger);
    const sourceFilePaths = await this.fileGlob.findFiles();
    const eslintRules: ESLintRules = this.getESLintRules(logger);
    const projectRoot = asBollDirectory(process.cwd());
    const sourceFiles = await Promise.all(
      sourceFilePaths.map((filename) => getSourceFile(projectRoot, filename, packageContext))
    );

    this.checks.forEach((r) => {
      sourceFiles.forEach(async (s) => {
        if (r.type === "PackageRule") {
          const results = r.check(s);
          resultSet.add(results);
        } else if (r.type === "ESLintRule") {
          const eslintConfig = await eslintRules.getSourceFileConfig(s.filename);
          const eslintConfigWithFilename = { ...eslintConfig, filename: s.filename };
          const results = r.check(eslintConfigWithFilename);
          resultSet.add(results);
        }
      });
    });

    return resultSet;
  }

  private async loadPackage(logger: Logger) {
    const filename = path.resolve("./package.json");
    try {
      const packageBuffer = await readFileAsync(filename);
      const packageJson = JSON.parse(packageBuffer.toString("utf-8"));
      const packageContext = new Package(packageJson.dependencies || {});
      return packageContext;
    } catch (e) {
      logger.error(`Error loading ${filename}`);
      throw e;
    }
  }

  private getESLintRules(logger: Logger): ESLintRules {
    const resolvePluginsRelativeTo = this.config.eslintOptions && this.config.eslintOptions.resolvePluginsRelativeTo;
    const fullPath = resolvePluginsRelativeTo && path.resolve(process.cwd(), resolvePluginsRelativeTo);
    return fullPath
      ? new ESLintRules({ resolvePluginsRelativeTo: asBollDirectory(fullPath), logger })
      : new ESLintRules({ logger });
  }
}
