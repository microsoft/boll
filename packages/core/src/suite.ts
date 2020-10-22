import fs from "fs";
import path from "path";
import { asBollDirectory } from "./boll-directory";
import { ConfigDefinition } from "./types";
import { getSourceFile } from "./file-context";
import { Logger } from "./logger";
import { Package } from "./package";
import { ResultSet } from "./result-set";
import { RuleSet } from "./rule-set";
import { promisify } from "util";
const readFileAsync = promisify(fs.readFile);

export class Suite {
  private _hasRun = false;
  public ruleSets: RuleSet[] = [];

  get hasRun(): boolean {
    return this._hasRun;
  }

  async run(logger: Logger): Promise<ResultSet> {
    this._hasRun = true;
    const resultSet = new ResultSet();
    for (let i = 0; i < this.ruleSets.length; i++) {
      await this.runRuleSet(logger, this.ruleSets[i], resultSet);
    }
    return resultSet;
  }

  async runRuleSet(logger: Logger, ruleSet: RuleSet, resultSet: ResultSet): Promise<boolean> {
    const packageContext = await this.loadPackage(logger);
    const sourceFilePaths = await ruleSet.fileGlob.findFiles();
    const projectRoot = asBollDirectory(process.cwd());
    const sourceFiles = await Promise.all(
      sourceFilePaths.map(filename => getSourceFile(projectRoot, filename, packageContext))
    );

    ruleSet.checks.forEach(r => {
      sourceFiles.forEach(async s => {
        if (s.shouldSkip(r)) return;
        const results = await r.check(s);
        resultSet.add(results);
      });
    });
    return true;
  }

  private async loadPackage(logger: Logger) {
    const filename = path.resolve("./package.json");
    try {
      const packageBuffer = await readFileAsync(filename);
      const packageJson = JSON.parse(packageBuffer.toString("utf-8"));
      const packageContext = new Package(packageJson.dependencies || {}, packageJson.devDependencies || {});
      return packageContext;
    } catch (e) {
      logger.error(`Error loading ${filename}`);
      throw e;
    }
  }
}
