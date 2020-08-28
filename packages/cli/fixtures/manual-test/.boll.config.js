"use strict";
module.exports = {
  checks: [
    { rule: "SrcDetector" },
    // { rule: "CrossPackageDependencyDetector" }, // toggle commenting/uncommenting this line to verify rule loading works!
  ],
  exclude: ["./taskConfig/**/*"],
};
