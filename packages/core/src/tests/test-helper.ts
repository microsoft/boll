import os from "os";
import path from "path";
import { mkdtemp } from "fs";
import { promisify } from "util";
import { asBollDirectory, BollDirectory } from "../boll-directory";
const mkdtempAsync = promisify(mkdtemp);

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

export const inFixtureDir = async (fixture: string, cb: (location: BollDirectory) => Promise<void>) => {
  const original = process.cwd();
  try {
    const fixtureLocation = asBollDirectory(path.join(__dirname, "..", "..", "fixtures", fixture));
    process.chdir(fixtureLocation);
    await cb(fixtureLocation);
  } finally {
    process.chdir(original);
  }
};
