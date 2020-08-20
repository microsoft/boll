import { Logger } from "./logger";

export class Suite {
  private _hasRun = false;
  run(logger: Logger) {
    this._hasRun = true;
  }
  get hasRun(): boolean {
    return this._hasRun;
  }
}
