/**
 * SrcDetector will detect usages of `src` in
 * import statements of typescript source files.
 *
 * `src` as a portion of a path indicates that source
 * files from upstream dependencies are being compiled
 * in a project rather than being consumed from compiled
 * sources.
 */
export class SrcDetector {
  check(importPaths: string[]): Result {
    if (importPaths.some((i) => i.toLowerCase().includes("/src/"))) {
      return Result.fail();
    }
    return Result.succeed();
  }
}

class Result {
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
