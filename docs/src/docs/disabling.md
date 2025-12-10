# Disabling rules

Any rule can be disabled by adding a comment to a source file. Rule
names default to those specified in source, but can be overriden by a
project's own configuration. Be sure to use the name of the rule in
the boll output to ensure it is disabled correctly.

## Disable a single rule

Simply add a comment starting with `boll-disable`.

```js
/* boll-disable SrcDetector */
```

## Disabling multiple rules

Rule names may be comma separated as well.

```js
/* boll-disable SrcDetector, CrossPackageDependencyDetector */
```
