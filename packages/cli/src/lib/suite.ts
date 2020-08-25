import fs from "fs";
import glob from "glob";
import path from "path";
import ts from "typescript";
import { FileContext } from "./file-context";
import { Logger } from "./logger";
import { Package } from "./package";
import { PackageRule } from "./package-rule";
import { ResultSet } from "./result-set";
import { CrossPackageDependencyDetector } from "../rules/cross-package-dependency-detector";
import { SrcDetector } from "../rules/src-detector";
import { TransitiveDependencyDetector } from "../rules/transitive-dependency-detector";
import { promisify } from "util";
import { asBollFile } from "./boll-file";
import { BollDirectory, asBollDirectory } from "./boll-directory";
const readFileAsync = promisify(fs.readFile);
const globAsync = promisify(glob);

async function getSourceFile(
  projectRoot: BollDirectory,
  filename: string,
  packageContext: Package
): Promise<FileContext> {
  const normalizedFile = path.normalize(filename).replace(/\\/g, "/");
  const content = await readFileAsync(normalizedFile);
  const source = ts.createSourceFile(
    normalizedFile,
    content.toString("utf8"),
    ts.ScriptTarget.ES5,
    true
  );
  return new FileContext(
    projectRoot,
    packageContext,
    asBollFile(filename),
    source
  );
}

export class Suite {
  private _hasRun = false;

  public checks: PackageRule[] = [];

  get hasRun(): boolean {
    return this._hasRun;
  }

  async run(logger: Logger): Promise<ResultSet> {
    this._hasRun = true;

    const resultSet = new ResultSet();
    const rules: PackageRule[] = [
      new SrcDetector(),
      new TransitiveDependencyDetector(),
      new CrossPackageDependencyDetector(),
    ];
    const packageContext = await this.loadPackage(logger);
    const sourceFilePaths = await globAsync("./{,!(node_modules)/**}/*.ts");
    const projectRoot = asBollDirectory(process.cwd());
    const sourceFiles = await Promise.all(
      sourceFilePaths.map((filename) =>
        getSourceFile(projectRoot, filename, packageContext)
      )
    );

    rules.forEach((r) => {
      sourceFiles.forEach((s) => {
        const results = r.check(s);
        resultSet.add(results);
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
}
