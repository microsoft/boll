import { readdir } from "fs";
import * as path from "path";
import { promisify } from "util";
const readdirAsync = promisify(readdir);

export async function findFixturesDir(dir: string): Promise<string> {
  let curr = dir;
  while (curr !== "fixtures") {
    const contents = await readdirAsync(curr);
    const fixtures = contents.find(c => c === "fixtures");
    if (fixtures) break;
    const prev = path.dirname(curr);
    if (prev === curr) throw new Error("Could not find fixtures directory");
    curr = prev;
  }
  return path.join(curr, "fixtures");
}
