import { BollFile } from "./boll-file";
import { BollLineNumber } from "./boll-line-number";
import { ResultStatus } from "./types";

export interface Result {
  formattedMessage: string;
  status: ResultStatus;
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
  errors: Result[] = [];

  get hasErrors(): boolean {
    return this.errors.length > 0;
  }

  add(results: Result[]) {
    results.forEach(result => {
      if (result.status === ResultStatus.failure) {
        this.errors.push(result);
      }
    });
  }
}
