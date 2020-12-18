export interface Formatter {
  finishWithErrors(): string;
  finishWithWarnings(): string;
  warn(str: string): string;
  info(str: string): string;
  error(str: string): string;
}
