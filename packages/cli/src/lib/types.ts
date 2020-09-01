import { BollFile } from "./boll-file";
import { FileContext } from "./file-context";
import { Result } from "./result-set";
import { ConfigContext } from "./config-context";

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

export interface Rule {
  check(file: any): Result[];
}

export interface PackageRule extends Rule {
  check(file: FileContext): Result[];
}

export interface ConfigRule extends Rule {
  check(file: ConfigContext): Result[];
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
