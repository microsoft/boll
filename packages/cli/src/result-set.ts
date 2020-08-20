export class Result {
  filename: string = "";

  constructor(public status: ResultStatus, public text: string = "") {}

  static fail(text: string = ""): Result {
    const result = new Result(ResultStatus.failure, text);
    return result;
  }

  static succeed(): Result {
    const result = new Result(ResultStatus.success);
    return result;
  }
}
export enum ResultStatus {
  success,
  failure,
}

export class ResultSet {
  add(results: Result) {
    if (results.status === ResultStatus.failure) {
      this.errors.push(results);
    }
  }
  errors: Result[] = [];
}
