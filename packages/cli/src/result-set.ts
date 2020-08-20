export class Result {
  constructor(public status: ResultStatus) {}

  static fail(): Result {
    const result = new Result(ResultStatus.failure);
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
  errors: Result[] = [Result.fail()];
}
