'use strict';

import { gulp, plugins, args, config, dirs, taskTarget, browserSync } from '../config/shared-vars';

import path from 'path';
import gulpif from 'gulp-if';
import pngquant from 'imagemin-pngquant';

export default function() {
	let dirs = config.directories;
	let dest = path.join(taskTarget, config.basePath, dirs.assets, dirs.images.replace(/^_/, ''));

	// Imagemin
	gulp.task('imagemin', () => {
		//copies the non-typical-image favicon files into their places
		gulp.src([
				path.join(dirs.source, dirs.images, '**/favicon/*.{json,ico,xml}'),
			])
			.pipe(plugins.changed(dest))
			.pipe(gulp.dest(dest));

		return gulp.src([
			path.join(dirs.source, dirs.images, '**/*.{jpg,jpeg,gif,svg,png}'),
			path.join(dirs.source, dirs.pages, '**/*.{jpg,jpeg,gif,svg,png}'),
		])
			.pipe(plugins.changed(dest))
			.pipe(gulpif(args.production, plugins.imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngquant({speed: 10})]
			})))
			.pipe(gulp.dest(dest));
	});
}
