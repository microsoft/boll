import { foo } from '@foo/foo-package';

// test
import { foo } from '@some/other-package';
/*
transitive
*/
import { test } from '@test/test-package';
import { bar } from '@bar/bar-package';
