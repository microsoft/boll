export type BollLineNumber = number & { __id: "BollLineNumber" };

export function asBollLineNumber(lineNumber: number): BollLineNumber {
  return lineNumber as BollLineNumber;
}
