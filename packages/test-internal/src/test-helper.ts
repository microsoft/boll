import os from "os";
import path from "path";
import { mkdtemp } from "fs";
import { promisify } from "util";
import { findFixturesDir } from "./utils";
const mkdtempAsync = promisify(mkdtemp);

type BollDirectory = string & { __id: "BollDirectory" };

function asBollDirectory(dirPath: string): BollDirectory {
  return path.resolve(dirPath) as BollDirectory;
}

export const inTmpDir = async (cb: () => Promise<void>) => {
  const original = process.cwd();
  try {
    const prefix = path.join(os.tmpdir(), "boll-test");
    const tempDir = await mkdtempAsync(prefix);
    process.chdir(tempDir);
    await cb();
  } finally {
    process.chdir(original);
  }
};

export const inFixtureDir = async (fixture: string, dir: string, cb: (location: BollDirectory) => Promise<void>) => {
  const original = process.cwd();
  try {
    const fixtureLocation = asBollDirectory(path.join(await findFixturesDir(dir), fixture));
    process.chdir(fixtureLocation);
    await cb(fixtureLocation);
  } finally {
    process.chdir(original);
  }
};
