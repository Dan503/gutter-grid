'use strict';

import {
	gulp,
	plugins,
	args,
	config,
	dirs,
	taskTarget,
	browserSync,
	jsWatch,
} from '../config/shared-vars';

import path from 'path';

let local = dirs.source + '/';
let browserSyncTask =
	config.serve === 'html' ? 'browserSync:html' : 'browserSync:php';

const set_up_watchers = (done) => {
	//standard scss changes only trigger the sass:compile task to be as fast as possible
	gulp.watch(
		[
			local + '/**/*.{scss,sass}',
			'*.{scss,sass}',
			'!' + local + dirs.icons + '/variables.scss',
		],
		gulp.series('sass:compile')
	);

	//when the icon font is altered, it runs the full sass function and does a browser refresh
	gulp
		.watch([local + dirs.icons + '/variables.scss'], gulp.series('sass'))
		.on('change', browserSync.reload);

	// JS
	gulp.watch(
		[
			local + dirs.scripts + '/**/*.js',
			local + dirs.modules + '/**/*.js',
			local + 'prototype-only/**/*.js',
			'./' + dirs.jsUtils + '/**/*.js',
		],
		gulp.series('scripts')
	);

	// JS
	gulp.watch(
		[local + dirs.scripts + '/ie8-main.js'],
		gulp.series('copy:scripts')
	);

	// Pug file changes only compiles existing pug files
	gulp.watch(
		[
			local + '**/*.pug',
			local + dirs.data + '/**/*.{json,yaml,yml}',
			'!' + local + dirs.data + '/navMap.json',
			'!' + local + 'pages/**/index.pug',
		],
		gulp.series('pug:compile')
	);

	// Nav map file changes do full page generation re-compiles
	gulp.watch([local + dirs.data + '/navMap.json'], gulp.series('pug'));

	//Copy
	gulp.watch(
		[
			local + '**/*',
			'!' + local + '{**/_*,**/_*/**}',
			'!' + local + '**/*.{pug,scss,sass,js}',
		],
		gulp.series('copy')
	);

	// Images
	gulp.watch(
		[local + dirs.images + '/**/*.{jpg,jpeg,gif,svg,png}'],
		gulp.series('imagemin', 'pug')
	);

	//All other files
	gulp
		.watch([
			path.join(dirs.temporary, '**/*'),
			'!' + path.join(dirs.temporary, '**/*.{css,scss,map,html,js}'),
		])
		.on('change', browserSync.reload);

	done();
};

// Watch task
gulp.task(
	'watch',
	gulp.series(browserSyncTask, jsWatch.enable, set_up_watchers)
);
