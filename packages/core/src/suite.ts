import fs from "fs";
import path from "path";
import { asBollDirectory } from "./boll-directory";
import { FileContext, getSourceFile } from "./file-context";
import { Logger } from "./logger";
import { parse } from "./package";
import { Failure, Result, ResultSet } from "./result-set";
import { InstantiatedRule, RuleSet } from "./rule-set";
import { ResultStatus } from "./types";
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

    await Promise.all(
      ruleSet.fileChecks.map(async r => {
        await Promise.all(
          sourceFiles.map(async s => {
            if (s.shouldSkip(r)) return;
            const results = await r.check(s);
            const filteredResults = await this.filterIgnoredChecksByLine(results, s);
            this.addFailuresWithSeverity(r, filteredResults, resultSet);
          })
        );
      })
    );

    await Promise.all(
      ruleSet.metaChecks.map(async r => {
        const unskippedSourceFiles = sourceFiles.filter(s => !s.shouldSkip(r));
        const results = await r.check(unskippedSourceFiles);
        this.addFailuresWithSeverity(r, results, resultSet);
      })
    );

    return true;
  }

  private async loadPackage(logger: Logger) {
    const filename = path.resolve("./package.json");
    try {
      const packageBuffer = await readFileAsync(filename);
      const packageJson = parse(packageBuffer.toString("utf-8"));

      return packageJson;
    } catch (e) {
      logger.error(`Error loading ${filename}`);
      throw e;
    }
  }

  async filterIgnoredChecksByLine(results: Result[], sourceFile: FileContext) {
    const ignoredChecksByLine = sourceFile.ignoredChecksByLine;
    const filteredResults: Result[] = [];
    results.forEach(l => {
      if (l.status === ResultStatus.failure) {
        const failure = l as Failure;
        const skipLineNumber = failure.line - 1;
        if (
          !(
            ignoredChecksByLine.has(skipLineNumber) &&
            ignoredChecksByLine.get(skipLineNumber)?.includes(failure.ruleName)
          )
        ) {
          filteredResults.push(l);
        }
      }
    });
    return filteredResults;
  }

  private addFailuresWithSeverity(rule: InstantiatedRule, results: Result[], resultSet: ResultSet) {
    if (rule.severity === "error") {
      resultSet.addErrors(results);
    } else if (rule.severity === "warn") {
      resultSet.addWarnings(results);
    } else {
      throw new Error("Unknown severity! (This is likely a boll bug)");
    }
  }
}
