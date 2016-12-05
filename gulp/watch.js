'use strict';

export default function(gulp, plugins, args, browserSync) {

	// Watch task
	gulp.task('watch', ['browserSync'], () => {
			// Styles
			gulp.watch([
				'*.scss',
				'website-src/**/*.scss'
			], ['sass']);

			//Pug
			gulp.watch([
				'website-src/**/*.pug',
			], ['pug'], ()=>{
				browserSync.reload();
			});
	});
}
