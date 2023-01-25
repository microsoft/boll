import type { PackageInfo } from "workspace-tools";
export type { PackageInfo as Package };

export const parse = (fileContents: string): PackageInfo => {
  try {
    const json = JSON.parse(fileContents);

    return {
      ...json,
      dependencies: json.dependencies || {},
      devDependencies: json.devDependencies || {}
    };
  } catch (e) {
    console.log({ e });
    return {} as PackageInfo;
  }
};
