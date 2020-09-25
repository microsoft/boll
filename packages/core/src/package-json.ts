import { FileContext } from "./file-context";

export function asPackageJson(file: FileContext): PackageJson {
  return JSON.parse(file.content) as PackageJson;
}

export type PackageJson = CoreProperties &
  JspmDefinition &
  (
    | {
        bundleDependencies?: BundledDependency;
        [k: string]: unknown;
      }
    | {
        bundledDependencies?: BundledDependency;
        [k: string]: unknown;
      }
  );
/**
 * A person who has been involved in creating or maintaining this package
 */
export type Person =
  | {
      name: string;
      url?: string;
      email?: string;
      [k: string]: unknown;
    }
  | string;
export type PackageExportsEntry = PackageExportsEntryPath | PackageExportsEntryObject;
/**
 * The module path that is resolved when this specifier is imported.
 */
export type PackageExportsEntryPath = string;
/**
 * Used to allow fallbacks in case this environment doesn't support the preceding entries.
 */
export type PackageExportsFallback = PackageExportsEntry[];
/**
 * Run AFTER the package is published
 */
export type ScriptsPublishAfter = string;
/**
 * Run AFTER the package is installed
 */
export type ScriptsInstallAfter = string;
/**
 * Run BEFORE the package is uninstalled
 */
export type ScriptsUninstallBefore = string;
/**
 * Run BEFORE bump the package version
 */
export type ScriptsVersionBefore = string;
/**
 * Run by the 'npm test' command
 */
export type ScriptsTest = string;
/**
 * Run by the 'npm stop' command
 */
export type ScriptsStop = string;
/**
 * Run by the 'npm start' command
 */
export type ScriptsStart = string;
/**
 * Run by the 'npm restart' command. Note: 'npm restart' will run the stop and start scripts if no restart script is provided.
 */
export type ScriptsRestart = string;
/**
 * Array of package names that will be bundled when publishing the package.
 */
export type BundledDependency = string[] | false;

export interface CoreProperties {
  /**
   * The name of the package.
   */
  name?: string;
  /**
   * Version must be parseable by node-semver, which is bundled with npm as a dependency.
   */
  version?: string;
  /**
   * This helps people discover your package, as it's listed in 'npm search'.
   */
  description?: string;
  /**
   * This helps people discover your package as it's listed in 'npm search'.
   */
  keywords?: string[];
  /**
   * The url to the project homepage.
   */
  homepage?: string;
  /**
   * The url to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package.
   */
  bugs?:
    | {
        /**
         * The url to your project's issue tracker.
         */
        url?: string;
        /**
         * The email address to which issues should be reported.
         */
        email?: string;
        [k: string]: unknown;
      }
    | string;
  /**
   * You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you're placing on it.
   */
  license?: string;
  /**
   * DEPRECATED: Instead, use SPDX expressions, like this: { "license": "ISC" } or { "license": "(MIT OR Apache-2.0)" } see: 'https://docs.npmjs.com/files/package.json#license'
   */
  licenses?: {
    type?: string;
    url?: string;
    [k: string]: unknown;
  }[];
  author?: Person;
  /**
   * A list of people who contributed to this package.
   */
  contributors?: Person[];
  /**
   * A list of people who maintains this package.
   */
  maintainers?: Person[];
  /**
   * The 'files' field is an array of files to include in your project. If you name a folder in the array, then it will also include the files inside that folder.
   */
  files?: string[];
  /**
   * The main field is a module ID that is the primary entry point to your program.
   */
  main?: string;
  /**
   * The "exports" field is used to restrict external access to non-exported module files, also enables a module to import itself using "name".
   */
  exports?:
    | string
    | {
        /**
         * The module path that is resolved when the path component of the module specifier matches the property name.
         *
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "^\./".
         */
        [k: string]:
          | PackageExportsEntry
          | (PackageExportsFallback & {
              /**
               * The module path that is resolved when the module specifier matches "name", shadows the "main" field.
               */
              "."?: PackageExportsEntry | PackageExportsFallback;
              /**
               * The module path prefix that is resolved when the module specifier starts with "name/", set to "./" to allow external modules to import any subpath.
               */
              "./"?: PackageExportsEntry | PackageExportsFallback;
            });
      }
    | {
        /**
         * The module path that is resolved when this environment matches the property name.
         *
         * This interface was referenced by `PackageExportsEntryObject`'s JSON-Schema definition
         * via the `patternProperty` "^(?!\.).".
         *
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "^(?!\.).".
         */
        [k: string]: string & {
          /**
           * The module path that is resolved when this specifier is imported as a CommonJS module using the `require(...)` function.
           */
          require?: string;
          /**
           * The module path that is resolved when this specifier is imported as an ECMAScript module using an `import` declaration or the dynamic `import(...)` function.
           */
          import?: string;
          /**
           * The module path that is resolved when this environment is Node.js.
           */
          node?: string;
          /**
           * The module path that is resolved when no other export type matches.
           */
          default?: string;
        };
      }
    | PackageExportsEntry[];
  bin?:
    | string
    | {
        [k: string]: string;
      };
  /**
   * When set to "module", the type field allows a package to specify all .js files within are ES modules. If the "type" field is omitted or set to "commonjs", all .js files are treated as CommonJS.
   */
  type?: "commonjs" | "module";
  /**
   * Set the types property to point to your bundled declaration file
   */
  types?: string;
  /**
   * Note that the "typings" field is synonymous with "types", and could be used as well.
   */
  typings?: string;
  /**
   * The "typesVersions" field is used since TypeScript 3.1 to support features that were only made available in newer TypeScript versions.
   */
  typesVersions?: {
    /**
     * Contains overrides for the TypeScript version that matches the version range matching the property key.
     */
    [k: string]: {
      /**
       * Maps all file paths to the file paths specified in the array.
       */
      "*"?: string[];
    };
  };
  /**
   * Specify either a single file or an array of filenames to put in place for the man program to find.
   */
  man?: string[];
  directories?: {
    /**
     * If you specify a 'bin' directory, then all the files in that folder will be used as the 'bin' hash.
     */
    bin?: string;
    /**
     * Put markdown files in here. Eventually, these will be displayed nicely, maybe, someday.
     */
    doc?: string;
    /**
     * Put example scripts in here. Someday, it might be exposed in some clever way.
     */
    example?: string;
    /**
     * Tell people where the bulk of your library is. Nothing special is done with the lib folder in any way, but it's useful meta info.
     */
    lib?: string;
    /**
     * A folder that is full of man pages. Sugar to generate a 'man' array by walking the folder.
     */
    man?: string;
    test?: string;
    [k: string]: unknown;
  };
  /**
   * Specify the place where your code lives. This is helpful for people who want to contribute.
   */
  repository?:
    | {
        type?: string;
        url?: string;
        directory?: string;
        [k: string]: unknown;
      }
    | string;
  /**
   * The 'scripts' member is an object hash of script commands that are run at various times in the lifecycle of your package. The key is the lifecycle event, and the value is the command to run at that point.
   */
  scripts?: {
    /**
     * Run BEFORE the package is published (Also run on local npm install without any arguments)
     */
    prepublish?: string;
    /**
     * Run both BEFORE the package is packed and published, and on local npm install without any arguments. This is run AFTER prepublish, but BEFORE prepublishOnly
     */
    prepare?: string;
    /**
     * Run BEFORE the package is prepared and packed, ONLY on npm publish
     */
    prepublishOnly?: string;
    /**
     * run BEFORE a tarball is packed (on npm pack, npm publish, and when installing git dependencies)
     */
    prepack?: string;
    /**
     * Run AFTER the tarball has been generated and moved to its final destination.
     */
    postpack?: string;
    publish?: ScriptsPublishAfter;
    postpublish?: ScriptsPublishAfter;
    /**
     * Run BEFORE the package is installed
     */
    preinstall?: string;
    install?: ScriptsInstallAfter;
    postinstall?: ScriptsInstallAfter;
    preuninstall?: ScriptsUninstallBefore;
    uninstall?: ScriptsUninstallBefore;
    /**
     * Run AFTER the package is uninstalled
     */
    postuninstall?: string;
    preversion?: ScriptsVersionBefore;
    version?: ScriptsVersionBefore;
    /**
     * Run AFTER bump the package version
     */
    postversion?: string;
    pretest?: ScriptsTest;
    test?: ScriptsTest;
    posttest?: ScriptsTest;
    prestop?: ScriptsStop;
    stop?: ScriptsStop;
    poststop?: ScriptsStop;
    prestart?: ScriptsStart;
    start?: ScriptsStart;
    poststart?: ScriptsStart;
    prerestart?: ScriptsRestart;
    restart?: ScriptsRestart;
    postrestart?: ScriptsRestart;
    [k: string]: string | undefined;
  };
  /**
   * A 'config' hash can be used to set configuration parameters used in package scripts that persist across upgrades.
   */
  config?: {
    [k: string]: unknown;
  };
  dependencies?: Dependency;
  devDependencies?: Dependency;
  optionalDependencies?: Dependency;
  peerDependencies?: Dependency;
  /**
   * When a user installs your package, warnings are emitted if packages specified in "peerDependencies" are not already installed. The "peerDependenciesMeta" field serves to provide more information on how your peer dependencies are utilized. Most commonly, it allows peer dependencies to be marked as optional. Metadata for this field is specified with a simple hash of the package name to a metadata object.
   */
  peerDependenciesMeta?: {
    [k: string]: {
      /**
       * Specifies that this peer dependency is optional and should not be installed automatically.
       */
      optional?: boolean;
      [k: string]: unknown;
    };
  };
  resolutions?: Dependency;
  engines?: {
    [k: string]: string & {
      node?: string;
    };
  };
  engineStrict?: boolean;
  /**
   * You can specify which operating systems your module will run on
   */
  os?: string[];
  /**
   * If your code only runs on certain cpu architectures, you can specify which ones.
   */
  cpu?: string[];
  /**
   * DEPRECATED: This option used to trigger an npm warning, but it will no longer warn. It is purely there for informational purposes. It is now recommended that you install any binaries as local devDependencies wherever possible.
   */
  preferGlobal?: boolean;
  /**
   * If set to true, then npm will refuse to publish it.
   */
  private?: boolean | ("false" | "true");
  publishConfig?: {
    access?: "public" | "restricted";
    tag?: string;
    registry?: string;
    [k: string]: unknown;
  };
  dist?: {
    shasum?: string;
    tarball?: string;
    [k: string]: unknown;
  };
  readme?: string;
  /**
   * An ECMAScript module ID that is the primary entry point to your program.
   */
  module?: string;
  /**
   * A module ID with untranspiled code that is the primary entry point to your program.
   */
  esnext?:
    | string
    | {
        [k: string]: string & {
          main?: string;
          browser?: string;
        };
      };
  /**
   * To configure your yarn workspaces, please note private should be set to true to use yarn workspaces
   */
  workspaces?: {
    [k: string]: unknown;
  };
  /**
   * Any property starting with _ is valid.
   *
   * This interface was referenced by `CoreProperties`'s JSON-Schema definition
   * via the `patternProperty` "^_".
   */
  [k: string]: any;
}
/**
 * Used to specify conditional exports, note that Conditional exports are unsupported in older environments, so it's recommended to use the fallback array option if support for those environments is a concern.
 */
export interface PackageExportsEntryObject {
  /**
   * The module path that is resolved when this environment matches the property name.
   *
   * This interface was referenced by `PackageExportsEntryObject`'s JSON-Schema definition
   * via the `patternProperty` "^(?!\.).".
   *
   * This interface was referenced by `undefined`'s JSON-Schema definition
   * via the `patternProperty` "^(?!\.).".
   */
  [k: string]: string & {
    /**
     * The module path that is resolved when this specifier is imported as a CommonJS module using the `require(...)` function.
     */
    require?: string;
    /**
     * The module path that is resolved when this specifier is imported as an ECMAScript module using an `import` declaration or the dynamic `import(...)` function.
     */
    import?: string;
    /**
     * The module path that is resolved when this environment is Node.js.
     */
    node?: string;
    /**
     * The module path that is resolved when no other export type matches.
     */
    default?: string;
  };
}
/**
 * Dependencies are specified with a simple hash of package name to version range. The version range is a string which has one or more space-separated descriptors. Dependencies can also be identified with a tarball or git URL.
 */
export interface Dependency {
  [k: string]: string;
}
export interface JspmDefinition {
  jspm?: CoreProperties;
  [k: string]: unknown;
}
