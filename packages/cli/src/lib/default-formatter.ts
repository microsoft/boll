import { Formatter } from "./formatter";

export class DefaultFormatter implements Formatter {
  finishWithErrors(): string {
    return "";
  }
  finishWithWarnings(): string {
    return "";
  }
  warn(str: string): string {
    return str;
  }
  info(str: string): string {
    return str;
  }
  error(str: string): string {
    return str;
  }
}
