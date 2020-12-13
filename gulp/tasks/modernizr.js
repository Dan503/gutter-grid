'use strict';

import {
	gulp,
	plugins,
	args,
	config,
	dirs,
	taskTarget,
	browserSync,
} from '../config/shared-vars';

import path from 'path';

export default function () {
	let dirs = config.directories;
	let modernizr_settings = {
		options: ['setClasses', 'html5printshiv', 'testProp'],
	};

	gulp.task('modernizr', ['copy'], function () {
		gulp
			.src([path.join(dirs.source, '**/*.{scss,sass,js}')])
			.pipe(plugins.modernizr('modernizr.min.js', modernizr_settings))
			.pipe(plugins.uglify())
			.pipe(
				gulp.dest(
					path.join(
						taskTarget,
						config.basePath,
						dirs.assets,
						dirs.scripts.replace(/^_[0-9]_/, '')
					)
				)
			);
	});
}
