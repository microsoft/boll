import { foo } from '@foo/foo-package';

// test
import { foo } from '@some/other-package';
/*
transitive
*/
import { foo } from '@some/other-package';
import { test } from '@test/test-package';

/*
Multi Comment
 */
//single comment
import { foo } from '@some/other-package';