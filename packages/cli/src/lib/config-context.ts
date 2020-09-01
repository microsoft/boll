import { BollFile } from "./boll-file";

export class ConfigContext {
  constructor(public filename: BollFile, public path: string) {}
}
