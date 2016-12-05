'use strict';

import pug from 'pug';

export default function(gulp, plugins, args, browserSync) {

	// Sass compilation
	gulp.task('pug', () => {
		gulp.src('website-src/*.pug')
			.pipe(plugins.plumber())
			.pipe(plugins.pug({
				pug: pug,
				basedir: 'website-src',
				filters: [ require('marked') ],
				pretty: true,
				locals: {
					require,
				}
			}))
			.pipe(gulp.dest('website'))
			.on('end', browserSync.reload);
	});
}
