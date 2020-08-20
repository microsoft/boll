import { Logger } from "./logger";
import { ResultSet } from "./result-set";

export class Suite {
  private _hasRun = false;
  async run(logger: Logger): Promise<ResultSet> {
    this._hasRun = true;
    return new ResultSet();
  }
  get hasRun(): boolean {
    return this._hasRun;
  }
}
