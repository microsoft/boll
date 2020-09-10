import chalk from "chalk";

type MessagePrinter = (msg: string) => void;
export class Logger {
  constructor(
    private logPrinter: MessagePrinter,
    private warnPrinter: MessagePrinter,
    private errorPrinter: MessagePrinter
  ) {}

  log(msg: string) {
    this.logPrinter(msg);
  }

  warn(msg: string) {
    this.warnPrinter(msg);
  }

  error(msg: string) {
    this.errorPrinter(msg);
  }
}

export const DefaultLogger = new Logger(console.log, console.warn, console.error);
export const ChalkLogger = new Logger(
  (msg) => console.log(chalk.green(msg)),
  (msg) => console.warn(chalk.yellow(msg)),
  (msg) => console.error(chalk.red(msg))
);
const empty = (a: string) => {};
export const NullLogger = new Logger(empty, empty, empty);
