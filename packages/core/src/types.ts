import { BollFile } from "./boll-file";
import { FileContext } from "./file-context";
import { Result } from "./result-set";

export interface CheckConfiguration {
  rule: string;
  options?: {};
}

export interface ConfigDefinition {
  name?: string;
  checks?: CheckConfiguration[];
  extends?: string;
  exclude?: string[];
  include?: string[];
  eslintOptions?: ESLintOptions;
}

export interface ESLintOptions {
  resolvePluginsRelativeTo?: string;
}

export interface PackageRule {
  name: string;
  check(file: FileContext): Promise<Result[]>;
}

export enum ResultStatus {
  success,
  failure
}

export interface FileGlob {
  findFiles(): Promise<BollFile[]>;
  exclude: string[];
  include: string[];
}

export interface FileGlobOptions {
  exclude?: string[];
  include?: string[];
}
