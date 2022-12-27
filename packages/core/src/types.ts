import { BollFile } from "./boll-file";
import { FileContext } from "./file-context";
import { Result } from "./result-set";
import { Logger } from "./logger";

export interface CheckConfiguration {
  rule: string;
  severity?: "warn" | "error";
  options?: {};
}

export interface Checks {
  file?: CheckConfiguration[];
  meta?: CheckConfiguration[];
}

export interface RuleSetConfiguration {
  fileLocator: FileGlob;
  checks?: Checks;
  exclude?: string[];
  include?: string[];
  name?: string;
}

export interface ConfigDefinition {
  name?: string;
  extends?: string;
  exclude?: string[];
  ruleSets?: RuleSetConfiguration[];
  excludeGitControlledFiles?: boolean;
  configuration?: {
    rules?: {};
    ruleSets?: {};
  };
}

export interface Rule {
  name: string;
}

export interface CheckFunctionOptions {
  logger: Logger;
  [key: string]: string | Logger;
}

export interface PackageRule extends Rule {
  check(file: FileContext, options?: CheckFunctionOptions): Promise<Result[]>;
  check(file: FileContext): Promise<Result[]>;
}

export interface PackageMetaRule extends Rule {
  check(files: FileContext[], options?: CheckFunctionOptions): Promise<Result[]>;
  check(files: FileContext[]): Promise<Result[]>;
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

export interface ImportPathAndLineNumber {
  path: string;
  lineNumber: number;
}

export type CheckSeverity = "warn" | "error";
