/* boll-disable SrcDetector, CrossPackageDependencyDetector */

import { SomethingIShouldBeGettingElsewhere } from "@inappropriate-knowledge/packageFoo/src/some/file/hey/get/out";
import { ThisTranscendsPackages } from "../../project-b/some/path";

/* boll-disable TransitiveDependencyDetector */
