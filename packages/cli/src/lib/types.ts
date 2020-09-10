import { BollFile } from "./boll-file";
import { FileContext } from "./file-context";
import { Result } from "./result-set";
import { ConfigContext } from "./config-context";
import { BollDirectory } from "./boll-directory";

export type RuleType = "PackageRule" | "ESLintRule";

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

export interface Rule {
  name: string;
  check(file: any): Result[];
  type: RuleType;
}

export interface PackageRule extends Rule {
  check(file: FileContext): Result[];
}

export interface ESLintRule extends Rule {
  check(config: any): Result[];
}

export class PackageRuleType {
  get type(): RuleType {
    return "PackageRule";
  }
}

export class ESLintRuleType {
  get type(): RuleType {
    return "ESLintRule";
  }
}

export enum ResultStatus {
  success,
  failure,
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
