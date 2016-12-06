'use strict';

import pug from 'pug';

export default function(gulp, plugins, args, browserSync) {

	const pugFilters = [ require('marked') ];

	// Sass compilation
	gulp.task('pug', () => {
		gulp.src('website-src/*.pug')
			.pipe(plugins.plumber())
			.pipe(plugins.pug({
				pug: pug,
				basedir: 'website-src',
				filters: pugFilters,
				pretty: true,
				locals: {
					require,
					pugFilters,
					compile: pug.compile
				}
			}))
			.pipe(gulp.dest('website'))
			.on('end', browserSync.reload);
	});
}
