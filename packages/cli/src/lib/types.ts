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
}

export interface PackageRule {
  check(file: FileContext): Result[];
}

export enum ResultStatus {
  success,
  failure,
}

export interface FileGlob {
  findFiles(): Promise<BollFile[]>;
}

export interface FileGlobOptions {
  exclude?: string[];
  include?: string[];
}
