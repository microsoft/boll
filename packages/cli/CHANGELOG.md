# Change Log - @boll/cli

<!-- This log was last generated on Thu, 17 Apr 2025 00:27:24 GMT and should not be manually modified. -->

<!-- Start content -->

## 2.4.0

Thu, 17 Apr 2025 00:27:24 GMT

### Minor changes

- Transpile to es2017 (elcraig@microsoft.com)
- Bump @boll/core to v3.3.0

## 2.3.3

Thu, 27 Mar 2025 21:33:31 GMT

### Patches

- Bump @boll/core to v3.2.1

## 2.3.2

Thu, 20 Feb 2025 21:14:26 GMT

### Patches

- Use the same config loading logic when running boll via API and CLI (elcraig@microsoft.com)

## 2.3.1

Thu, 20 Feb 2025 20:55:32 GMT

### Patches

- Revert "use fs.readfileSync instead of require  (#133)" (jcreamer@microsoft.com)

## 2.3.0

Thu, 20 Feb 2025 20:04:54 GMT

### Minor changes

- change require of config to fs read (jcreamer@microsoft.com)

## 2.2.0

Mon, 17 Jul 2023 21:31:15 GMT

### Minor changes

- Add grouping option (bmuthengi@microsoft.com)
- Bump @boll/core to v3.2.0

## 2.0.0

Wed, 25 Jan 2023 20:39:53 GMT

### Major changes

- boll v3 updates * new addRule api * refactor to include workspace tools * add a way to autoload rules * upgrade typescript * support external plugin (jcreamer@microsoft.com)

## 1.2.0

Tue, 15 Dec 2020 17:22:23 GMT

### Minor changes

- CLI supports warnings and VSO output (jdh@microsoft.com)

## 1.1.1216

Fri, 20 Nov 2020 22:01:01 GMT

### Patches

- Fixing broken UTs (git was ignoring directories) and refactor ignore.ts code and deps to speed up performance (email not defined)

## 1.1.1214

Fri, 13 Nov 2020 22:25:19 GMT

### Patches

- Allow boll to exclude git ignored files (email not defined)

## 1.1.3

Fri, 25 Sep 2020 21:48:01 GMT

### Patches

- Adding internal testing package (email not defined)

## 1.1.1

Thu, 24 Sep 2020 21:39:25 GMT

### Patches

- Remove unnecessary dependencies (jdh@microsoft.com)

## 1.1.0

Fri, 18 Sep 2020 17:10:21 GMT

### Minor changes

- Added new category of rules for enforcing ESLint configurations (email not defined)

## 1.0.1

Thu, 17 Sep 2020 22:06:55 GMT

### Patches

- More package breakup. (jdh@microsoft.com)

## 1.0.0

Tue, 15 Sep 2020 20:23:35 GMT

### Major changes

- Move core modules to @boll/core (jdh@microsoft.com)

## 0.0.16

Thu, 03 Sep 2020 19:40:21 GMT

### Patches

- Allow per-file checks to be skipped with pragma. (jdh@microsoft.com)

## 0.0.15

Tue, 01 Sep 2020 21:34:00 GMT

### Patches

- Add base config rule class (email not defined)

## 0.0.14

Tue, 01 Sep 2020 21:31:10 GMT

### Patches

- config extending should use file globs too (jdh@microsoft.com)

## 0.0.13

Tue, 01 Sep 2020 19:30:14 GMT

### Patches

- Fix for redundant imports. (jdh@microsoft.com)

## 0.0.12

Tue, 01 Sep 2020 17:48:54 GMT

### Patches

- Multi level inheritance for configuration. (jdh@microsoft.com)

## 0.0.11

Fri, 28 Aug 2020 19:06:06 GMT

### Patches

- Include/exclude directives in config. (jdh@microsoft.com)

## 0.0.10

Thu, 27 Aug 2020 20:56:52 GMT

### Patches

- Export library accessible entrypoint. (jdh@microsoft.com)

## 0.0.9

Thu, 27 Aug 2020 17:59:09 GMT

### Patches

- More rules, better globbing, 20% less fat. (jdh@microsoft.com)

## 0.0.8

Wed, 26 Aug 2020 23:38:49 GMT

### Patches

- initial release (kchau@microsoft.com)
- fixing publish, redoing a publish (kchau@microsoft.com)
