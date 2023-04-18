import { BollFile } from "./boll-file";
import { BollLineNumber } from "./boll-line-number";
import { InstantiatedRule } from "./rule-set";
import { ResultStatus } from "./types";

export interface Result {
  formattedMessage: string;
  status: ResultStatus;
}

export interface RuleResult extends Result{
  registryName: string;
  ruleName: string;
}

export interface GroupedResult {
  [group: string]: {
    errors: RuleResult[];
    warnings: RuleResult[];
  }
}

export class Success implements Result {
  constructor(public ruleName: string) {}

  get status(): ResultStatus {
    return ResultStatus.success;
  }

  get formattedMessage(): string {
    return `[${this.ruleName}] Succeeded`;
  }
}

export class Failure implements Result {
  constructor(public ruleName: string, public filename: BollFile, public line: BollLineNumber, public text: string) {}

  get status(): ResultStatus {
    return ResultStatus.failure;
  }

  get formattedMessage(): string {
    return `[${this.ruleName}] ${this.filename}:${this.line} ${this.text}`;
  }
}

export class ResultSet {
  errors: RuleResult[] = [];
  warnings: RuleResult[] = [];
  

  get hasErrors(): boolean {
    return this.errors.length > 0;
  }

  get hasWarnings(): boolean {
    return this.warnings.length > 0;
  }

  getResultsByRegistry(): { [registerName: string]: { errors: RuleResult[]; warnings: RuleResult[] } } {
    return this.groupResults('registryName');
  }

  getResultsByRule(): { [ruleName: string]: { errors: RuleResult[]; warnings: RuleResult[] } } {
    return this.groupResults('ruleName');
  }

  private groupResults(groupBy: keyof RuleResult): GroupedResult {
    const groupedResult: GroupedResult = {};
    (<('errors' | 'warnings')[]>['errors', 'warnings']).forEach((resultType) => {
      this[resultType].forEach(result => {
        if(!groupedResult[result[groupBy]]) {
          groupedResult[result[groupBy]] = {
            errors: [],
            warnings: []
          };
        }
        groupedResult[result[groupBy]][resultType].push(result);
      });
    })

    return groupedResult;
}

  addErrors(results: Result[], rule: InstantiatedRule) {
    results.forEach((result) => {
      (<RuleResult>result).registryName = rule.registryName;
      (<RuleResult>result).ruleName = rule.name;

      if (result.status === ResultStatus.failure) {
        this.errors.push(<RuleResult>result);
      }
    });
  }

  addWarnings(results: Result[], rule: InstantiatedRule) {
    results.forEach(result => {
      (<RuleResult>result).registryName = rule.registryName;
      (<RuleResult>result).ruleName = rule.name;

      if (result.status === ResultStatus.failure) {
        this.warnings.push(<RuleResult>result);
      }
    });
  }
}
