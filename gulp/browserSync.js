'use strict';

export default function(gulp, plugins, args, browserSync) {

	// BrowserSync
	gulp.task('browserSync', () => {

		if (!args.open){
			console.log('\n  Use "gulp --open" to open a browser window with the site loaded in it.\n')
		}

		browserSync.init({
			open: args.open ? 'local' : false,
			port: 3000
		});
	});

}
