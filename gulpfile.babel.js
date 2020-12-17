import { gulp, plugins, args, dirs, jsWatch } from './gulp/config/shared-vars';

import './gulp/tasks/browserSync';
import './gulp/tasks/bump';
import './gulp/tasks/clean';
import './gulp/tasks/eslint';
import './gulp/tasks/icomoon-unpackager';
import './gulp/tasks/imagemin';
import './gulp/tasks/modernizr';
import './gulp/tasks/new';
import './gulp/tasks/pug';
import './gulp/tasks/sass';
import { scripts_task } from './gulp/tasks/scripts';
import './gulp/tasks/symbolize-svgs';
import './gulp/tasks/watch';

var clean = args.production ? gulp.series('clean', 'clean:livesite') : 'clean';

// Compiles all the code
gulp.task(
	'compile',
	gulp.parallel(
		'copy',
		'pug',
		scripts_task,
		'imagemin',
		'symbolize-svgs',
		'sass',
		'modernizr'
	)
);

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
