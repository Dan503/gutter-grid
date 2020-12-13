'use strict';

import wrench from 'wrench';
import { gulp, plugins, args, dirs, jsWatch } from './gulp/config/shared-vars';

// This will grab all js in the `tmp/gulp-local-clone` directory
// in order to load all gulp tasks
wrench
	.readdirSyncRecursive('./' + dirs.gulp + '/tasks')
	.filter((file) => {
		return /\.(js)$/i.test(file);
	})
	.map(function (file) {
		require('./' + dirs.gulp + '/tasks/' + file)();
	});

var clean = args.production ? gulp.series('clean', 'clean:livesite') : 'clean';

// Compiles all the code
gulp.task('compile', [
	'copy',
	'pug',
	'scripts',
	'imagemin',
	'symbolize-svgs',
	'sass',
	'modernizr',
]);

let user_used_serve = false;

gulp.task('serve', () => {
	user_used_serve = true;
	gulp.start('default');
});

// Testing
gulp.task('test', gulp.series('eslint'));

const enable_js_watch = (done) => {
	jsWatch.isEnabled = true;
	done();
};

const warn_not_to_use_serve_command = (done) => {
	if (user_used_serve) {
		// User friendly message for Yeogurt users who are used to running "gulp serve"
		setTimeout(() => {
			console.log(
				`\n   Just use "${plugins.util.colors.bold.green(
					'gulp'
				)}" rather than "${plugins.util.colors.bold.red('gulp serve')}" \n`
			);
		}, 2000);
	}
};

// Default task (cleans and builds then runs server then watches for changes)
gulp.task(
	'default',
	gulp.series(
		clean,
		enable_js_watch,
		'clean:pages:empty',
		'compile',
		'watch',
		warn_not_to_use_serve_command
	)
);

//Cleans and builds only with no server
gulp.task('build', gulp.series(clean, 'compile'));
