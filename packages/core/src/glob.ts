import fg from "fast-glob";
import { asBollFile, BollFile } from "./boll-file";
import { FileGlob, FileGlobOptions } from "./types";
import { getWorkspaces } from "workspace-tools";

async function findFiles(pattern: string | string[], include: string[], exclude: string[]): Promise<BollFile[]> {
  let paths = await fg(pattern, { ignore: [...exclude, "./**/node_modules/**"] });
  const inclusions = await fg(include);
  paths.push(...inclusions.filter(i => !paths.includes(i)));
  return paths.map(asBollFile);
}

export class TypescriptSourceGlob implements FileGlob {
  public include: string[] = [];
  public exclude: string[] = [];

  constructor(options: FileGlobOptions = {}) {
    if (options.include) {
      this.include = options.include;
    }
    if (options.exclude) {
      this.exclude = options.exclude;
    }
  }

  async findFiles(): Promise<BollFile[]> {
    return await findFiles("./**/*.ts?(x)", this.include, [...this.exclude, "./**/*.d.ts"]);
  }
}

export class PackageJsonGlob implements FileGlob {
  public include: string[] = [];
  public exclude: string[] = [];

  constructor(options: FileGlobOptions = {}) {
    if (options.include) {
      this.include = options.include;
    }
    if (options.exclude) {
      this.exclude = options.exclude;
    }
  }

  async findFiles(): Promise<BollFile[]> {
    return await findFiles("./package.json", this.include, this.exclude);
  }
}

export class WorkspacesGlob implements FileGlob {
  public exclude: string[] = [];
  public include: string[] = [];
  public cwd: string;

  constructor(cwd: string = "") {
    this.cwd = cwd;
  }

  findFiles(): Promise<BollFile[]> {
    const workspaces = getWorkspaces(this.cwd || process.cwd()).map(({ path }) => {
      return `${path}/package.json`;
    });

    return Promise.resolve(workspaces.map(asBollFile));
  }
}
