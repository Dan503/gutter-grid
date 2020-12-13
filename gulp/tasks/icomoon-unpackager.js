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
	let destination = dirs.temporary;

	//copies icons into the assets folder
	gulp.task('copy-icons', () => {
		let iconDest = path.join(
			taskTarget,
			config.basePath,
			dirs.assets,
			dirs.icons.replace('_', '')
		);
		return gulp
			.src(path.join(dirs.source, dirs.icons, '/**/*'))
			.pipe(plugins.changed(iconDest))
			.pipe(gulp.dest(iconDest));
	});

	//converts icon variables into a sass map (needed for icon functions and mixins)
	gulp.task('icomoon-unpackager', ['copy-icons'], () => {
		gulp
			.src(path.join(dirs.source, dirs.icons, 'variables.scss'))
			//prevents it from re-running the code if nothing has changed
			.pipe(plugins.changed(destination))
			//replaces the sass variable syntax with sass map syntax
			.pipe(
				plugins.replace(
					/\$icon-([A-z0-9\-_]*):\s\"\\([A-z0-9]*)";/g,
					'\t$1: "$2",'
				)
			)
			//removes the "$icomoon-font-path: "fonts" !default;" bit
			.pipe(
				plugins.replace(/\$icomoon-font-path: \"([A-z0-9]*)\" \!default\;/g, '')
			)
			.pipe(plugins.header('$icons: (\n'))
			.pipe(plugins.footer(');'))
			.pipe(
				plugins.header(
					'/*This is an automatically generated file. DO NOT EDIT! Update the icon font by dumping the contents of icomoon packages into the icomoon folder*/\n'
				)
			)
			.pipe(plugins.rename('icon-names.scss'))
			.pipe(gulp.dest(destination))
			.on('end', () => {
				gulp.start('copy-icons');
			});
	});
}
