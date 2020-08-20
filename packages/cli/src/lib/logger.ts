type MessagePrinter = (msg: string) => void;
export class Logger {
  constructor(
    private info: MessagePrinter,
    private warn: MessagePrinter,
    private error: MessagePrinter
  ) {}
  log(msg: string) {
    this.info(msg);
  }
}

export const DefaultLogger = new Logger(
  console.log,
  console.warn,
  console.error
);
const empty = (a: string) => {};
export const NullLogger = new Logger(empty, empty, empty);
