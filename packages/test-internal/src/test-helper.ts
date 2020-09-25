import { execSync } from "child_process";
import { mkdtemp, readFile, writeFile } from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import { findFixturesDir } from "./utils";
const mkdtempAsync = promisify(mkdtemp),
  readFileAsync = promisify(readFile),
  writeFileAsync = promisify(writeFile);

type BollFile = string & { __id: "BollFile" };
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

export const inTmpBranch = async (cb: () => Promise<void>) => {
  const tmpBranch = uuidv4();
  const originalBranch = execSync("git branch --show-current").toString().trim();
  try {
    execSync(`git checkout -b ${tmpBranch}`);
    await cb();
  } finally {
    execSync(`git checkout ${originalBranch} && git branch -d ${tmpBranch}`);
  }
};

export const tmpWriteToFile = async (input: BollFile, output: BollFile, cb: () => Promise<void>) => {
  const inputData = await readFileAsync(input);
  const originalData = await readFileAsync(output);
  await writeFileAsync(output, inputData);
  await cb();
  await writeFileAsync(output, originalData);
};
