import os from "os";
import path from "path";
import { mkdtemp, rename } from "fs";
import { promisify } from "util";
import { asBollDirectory, BollDirectory } from "../boll-directory";
import { BollFile } from "../boll-file";
const mkdtempAsync = promisify(mkdtemp);
const renameAsync = promisify(rename);

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

export const tempRename = async (file: BollFile, newName: string, cb: () => Promise<void>) => {
  const newPath = path.join(path.dirname(file), newName);
  try {
    await renameAsync(file, path.join(path.dirname(file), newName));
    await cb();
  } finally {
    await renameAsync(newPath, file);
  }
};
