'use strict';

import path from 'path';
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

//This file is missing from git on purpose as it holds an absolute system path that is different for every user
//the file is simply this one line edited to be the correct file path for your system:
// export default 'C:/Users/user.name/path/to/folder/with/content';
import asset_src from '../config/asset_src';
import content_src from '../config/content_src';

// Same as regular copy task but specific to the scripts folder
//excludes the main js file though
gulp.task('copy:scripts', () => {
	let dest = join(
		taskTarget,
		config.basePath,
		dirs.assets,
		dirs.scripts.replace(/_[0-9]_/, '')
	);
	return gulp
		.src([
			join(dirs.source, dirs.scripts, '**/*'),
			'!' + join(dirs.source, dirs.scripts, '{**/_*,**/_*/**}'),
			'!' + join(dirs.source, dirs.scripts, config.entries.js),
		])
		.pipe(plugins.changed(dest))
		.pipe(gulp.dest(dest));
});

gulp.task('copy:root-files', () => {
	return gulp.src(dirs.source + '/_root-files/*').pipe(gulp.dest(taskTarget));
});

gulp.task(
	'copy:dynamic-assets',
	gulp.series('clean:pages:dynamic-assets', (done) => {
		//copies all files file types into the content folder
		if (content_src() !== false) {
			return gulp
				.src(asset_src + '/' + dirs.pages + '/**/' + dirs.assets + '/**/*')
				.pipe(gulp.dest(dirs.source + '/' + dirs.pages))
				.pipe(gulp.dest(join(taskTarget, config.basePath, dirs.pages)));
		}

		done();
	})
);

// Copy all files/folders into tmp folder that aren't prefixed with an underscore
gulp.task(
	'copy',
	gulp.series('copy:scripts', 'copy:root-files', () => {
		let dest = join(taskTarget, config.basePath);
		return gulp
			.src([
				join(dirs.source, '**/*'),
				'!' + join(dirs.source, '/' + dirs.pages + '/**/' + dirs.assets + '/*'),
				'!' + join(dirs.source, '{**/_*,**/_*/**}'),
				'!' + join(dirs.source, '**/*.pug'),
			])
			.pipe(plugins.changed(dest))
			.pipe(gulp.dest(dest));
	})
);
