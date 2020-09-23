import { readFile } from "fs";
import * as path from "path";
import { promisify } from "util";
import { execSync } from "child_process";
import { BollFile } from "./boll-file";
import { PackageManifest } from "./package-manifest";
const readFileAsync = promisify(readFile);

const DEFAULT_MAIN_BRANCH = "master";

interface BranchToLoadedState {
  [branch: string]: boolean;
}

interface BranchToPackageManifest {
  [branch: string]: PackageManifest;
}

export class PackageManifestContext {
  private _isPackageManifestLoaded: boolean = false;
  private _pacakgeManifest?: PackageManifest = undefined;
  private _isMainBranchPackageManifestLoaded: BranchToLoadedState = {};
  private _mainBranchPacakgeManifest: BranchToPackageManifest = {};
  private _gitRoot?: string = undefined;

  public isRoot: boolean;

  constructor(public fileName: BollFile) {
    this.isRoot = !this.fileName.slice(process.cwd().length + 1).includes(path.sep);
  }

  async getPackageManifest(): Promise<PackageManifest> {
    if (this._isPackageManifestLoaded) return this._pacakgeManifest!;
    const fileContent = await readFileAsync(this.fileName);
    const fileContentString = fileContent.toString("utf-8");
    this._pacakgeManifest = JSON.parse(fileContentString) as PackageManifest;
    this._isPackageManifestLoaded = true;
    return this._pacakgeManifest!;
  }

  async getPackageManifestOnMainBranch(mainBranch?: string): Promise<PackageManifest> {
    const branch = mainBranch || DEFAULT_MAIN_BRANCH;
    if (this._isMainBranchPackageManifestLoaded[branch]) return this._mainBranchPacakgeManifest[branch];
    const normalizedFileName = this.fileName.slice(this.getGitRoot().length).replace(/\\/g, "/");
    const getMainBranchFileContentCommand = `git -P show ${branch}:${normalizedFileName}`;
    try {
      const mainBranchFileContent = execSync(getMainBranchFileContentCommand).toString();
      this._mainBranchPacakgeManifest[branch] = JSON.parse(mainBranchFileContent) as PackageManifest;
      this._isMainBranchPackageManifestLoaded[branch] = true;
      return this._mainBranchPacakgeManifest[branch];
    } catch (err) {
      throw new Error(`Could not get file data for file ${this.fileName} on branch ${branch}`);
    }
  }

  private getGitRoot(): string {
    if (this._gitRoot) return this._gitRoot;
    this._gitRoot = execSync("git rev-parse --show-toplevel").toString();
    return this._gitRoot;
  }
}
