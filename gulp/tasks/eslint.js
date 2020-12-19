/*eslint no-process-exit:0 */

'use strict';

import path from 'path';
import gulpif from 'gulp-if';
import {
	gulp,
	plugins,
	args,
	config,
	dirs,
	taskTarget,
	browserSync,
	join,
} from '../config/shared-vars';

// ESLint
gulp.task('eslint', () => {
	return gulp
		.src([
			join('gulpfile.js'),
			join(dirs.source, '**/*.js'),
			// Ignore all vendor folder files
			'!' + join('**/vendor/**', '*'),
		])
		.pipe(browserSync.reload({ stream: true, once: true }))
		.pipe(
			plugins.eslint({
				useEslintrc: true,
			})
		)
		.pipe(plugins.eslint.format())
		.pipe(gulpif(!browserSync.active, plugins.eslint.failAfterError()))
		.on('error', function () {
			if (!browserSync.active) {
				process.exit(1);
			}
		});
});
