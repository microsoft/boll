export type DependencyMap = { [depdencyName: string]: string };
export class Package {
  constructor(public dependencies: DependencyMap) {}
}
