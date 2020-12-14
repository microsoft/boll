import { Formatter } from "./formatter";

export class VsoFormatter implements Formatter {
  finishWithErrors(): string {
    return "##vso[task.complete result=Failed;]There were failures";
  }
  finishWithWarnings(): string {
    return "##vso[task.complete result=SucceededWithIssues;]There were warnings";
  }
  warn(str: string): string {
    return `##[warning]${str}`;
  }
  info(str: string): string {
    return str;
  }
  error(str: string): string {
    return `##[error]${str}`;
  }
}
