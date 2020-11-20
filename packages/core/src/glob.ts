import fg from "fast-glob";
import { asBollFile, BollFile } from "./boll-file";
import { FileGlob, FileGlobOptions } from "./types";

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
