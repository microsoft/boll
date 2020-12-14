import { BollFile } from "./boll-file";
import { FileContext } from "./file-context";
import { Result } from "./result-set";

export interface CheckConfiguration {
  rule: string;
  severity?: "warn" | "error";
  options?: {};
}

export interface RuleSetConfiguration {
  fileLocator: FileGlob;
  checks?: CheckConfiguration[];
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

export interface ImportPathAndLineNumber {
  path: string;
  lineNumber: number;
}

export type CheckSeverity = "warn" | "error";
