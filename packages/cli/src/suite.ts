export class Suite {
  private _hasRun = false;
  run(logger: (msg: string) => void) {
    this._hasRun = true;
  }
  get hasRun(): boolean {
    return this._hasRun;
  }
}
