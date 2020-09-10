import os from "os";
import path from "path";
import { mkdtemp } from "fs";
import { promisify } from "util";
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

export const inFixtureDir = async (fixture: string, cb: () => Promise<void>) => {
  const original = process.cwd();
  try {
    process.chdir(path.join(__dirname, "..", "..", "fixtures", fixture));
    await cb();
  } finally {
    process.chdir(original);
  }
};

export const inDir = async (dir: string, cb: () => Promise<void>) => {
  const original = process.cwd();
  try {
    process.chdir(dir);
    await cb();
  } finally {
    process.chdir(original);
  }
};
