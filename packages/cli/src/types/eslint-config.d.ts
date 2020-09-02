export interface EslintConfig {
  parserOptions?: any;
  parser?: string;
  rules?: EslintRules;
  plugins?: string[];
  processor?: string;
  overrides?: any[];
  env?: any;
  globals?: any;
  extends?: string[];
  noInlineConfig?: boolean;
  reportUnusedDisableDirectives?: boolean;
  settings?: any;
  root?: boolean;
}

export type EslintRuleSetting = string | string[] | number;

export interface EslintRules {
  [name: string]: EslintRuleSetting;
}
