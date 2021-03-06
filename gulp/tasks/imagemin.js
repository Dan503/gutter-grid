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
import gulpif from 'gulp-if';
import pngquant from 'imagemin-pngquant';

let dest = join(taskTarget, dirs.assets, dirs.images.replace(/^_/, ''));

/** copies the non-typical-image favicon files into their places */
const copy_favicons = () => {
	return gulp
		.src([join(dirs.source, dirs.images, '**/favicon/*.{json,ico,xml}')])
		.pipe(plugins.changed(dest))
		.pipe(gulp.dest(dest));
};

const minify_images = () => {
	return gulp
		.src([
			join(dirs.source, dirs.images, '**/*.{jpg,jpeg,gif,svg,png}'),
			join(dirs.source, dirs.pages, '**/*.{jpg,jpeg,gif,svg,png}'),
		])
		.pipe(plugins.changed(dest))
		.pipe(
			gulpif(
				args.production,
				plugins.imagemin({
					progressive: true,
					svgoPlugins: [{ removeViewBox: false }],
					use: [pngquant({ speed: 10 })],
				})
			)
		)
		.pipe(gulp.dest(dest));
};

// Imagemin
gulp.task('imagemin', gulp.parallel(copy_favicons, minify_images));
