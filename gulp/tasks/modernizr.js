'use strict';

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

import path from 'path';

import './copy';

let modernizr_settings = {
	options: ['setClasses', 'html5printshiv', 'testProp'],
};

const run_modernizr = () => {
	return gulp
		.src([join(dirs.source, '**/*.{scss,sass,js}')])
		.pipe(plugins.modernizr('modernizr.min.js', modernizr_settings))
		.pipe(plugins.uglify())
		.pipe(
			gulp.dest(
				join(
					taskTarget,
					config.basePath,
					dirs.assets,
					dirs.scripts.replace(/^_[0-9]_/, '')
				)
			)
		);
};

gulp.task('modernizr', gulp.series('copy', run_modernizr));
