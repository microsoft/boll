import fs from "graceful-fs";
import ts from "typescript";
import { promisify } from "util";
import { BollDirectory } from "./boll-directory";
import { BollFile, asBollFile } from "./boll-file";
import { DependencyMap, Package } from "./package";
import { PackageRule } from "./types";
const readFileAsync = promisify(fs.readFile);

export class FileContext {
  private _parsedIgnoreChecks = false;
  private _ignoredChecks: string[] = [];
  private _sourceFileLoaded: boolean = false;
  private _sourceFile?: ts.SourceFile = undefined;
  private _ignoredChecksByLine: Map<number, string[]> = new Map();

  constructor(
    public packageRoot: BollDirectory,
    public packageContext: Package,
    public filename: BollFile,
    public content: string
  ) {}

  get source(): ts.SourceFile {
    if (this._sourceFileLoaded) return this._sourceFile!;
    this._sourceFile = ts.createSourceFile(this.filename, this.content, ts.ScriptTarget.ES5, true);
    this._sourceFileLoaded = true;
    return this._sourceFile;
  }

  get packageDependencies(): DependencyMap {
    return this.packageContext.dependencies;
  }

  get packageDevDependencies(): DependencyMap {
    return this.packageContext.devDependencies;
  }

  get ignoredChecks(): string[] {
    if (this._parsedIgnoreChecks) return this._ignoredChecks;

    this.content.match(/boll-disable.*/g)?.forEach(line => {
      const capture = line.match(/boll-disable\s([\w,\s-]*)/);
      if (capture && capture.length > 0 && capture[1]) {
        capture[1]
          .split(",")
          .map(x => x.trim())
          .forEach(rule => this._ignoredChecks.push(rule));
      }
    });

    this._parsedIgnoreChecks = true;
    return this._ignoredChecks;
  }

  get ignoredChecksByLine(): Map<number, string[]> {
    const sourceFile = ts.createSourceFile(this.filename, this.content, ts.ScriptTarget.ES5, true);

    if (!sourceFile) return this._ignoredChecksByLine;

    sourceFile.forEachChild(n => {
      const lineNumber = sourceFile.getLineAndCharacterOfPosition(n.pos).line;
      const trimmedNodeText = n.getFullText().trim();
      let ignoredChecks: string[] = [];

      trimmedNodeText.match(/boll-disable-next-line.*/g)?.forEach(line => {
        const capture = line.match(/boll-disable-next-line\s([\w,\s-]*)/);
        if (capture && capture.length > 0 && capture[1]) {
          capture[1]
            .split(",")
            .map(x => x.trim())
            .forEach(rule => ignoredChecks.push(rule));
        }
      });
      if (ignoredChecks.length > 0) this._ignoredChecksByLine.set(lineNumber, ignoredChecks);
    });

    return this._ignoredChecksByLine;
  }

  get relativeFilename(): string {
    return this.filename.slice(process.cwd().length + 1);
  }

  shouldSkip(r: PackageRule) {
    return this.ignoredChecks.includes(r.name);
  }
}

export async function getSourceFile(
  projectRoot: BollDirectory,
  filename: string,
  packageContext: Package
): Promise<FileContext> {
  const bollFile = asBollFile(filename);
  const content = await readFileAsync(bollFile);
  return new FileContext(projectRoot, packageContext, bollFile, content.toString("utf8"));
}
