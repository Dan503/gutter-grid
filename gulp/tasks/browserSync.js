'use strict';

import {
	gulp,
	plugins,
	args,
	config,
	taskTarget,
	browserSync,
	basePath,
	join,
} from '../config/shared-vars';

let serverRoot = taskTarget;

gulp.task('php-server', function () {
	return plugins.connectPhp.server({
		base: serverRoot,
		port: 8010,
		keepalive: true,
	});
});

const run_proxy_server = () => {
	return browserSync.init({
		proxy: '127.0.0.1:8010',
		open: args.open ? 'local' : false,
		port: config.port || 3000,
	});
};

// BrowserSync
gulp.task('browserSync:php', gulp.series('php-server', run_proxy_server));

// BrowserSync
gulp.task('browserSync:html', () => {
	return browserSync.init({
		open: args.open ? 'local' : false,
		port: config.port || 3000,
		server: {
			baseDir: './' + taskTarget,
		},
	});
});
