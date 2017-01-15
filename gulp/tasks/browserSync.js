'use strict';

import { gulp, plugins, args, config, dirs, taskTarget, browserSync } from '../config/shared-vars';

export default function() {

	let serverRoot = taskTarget;

	gulp.task('php-server', function() {
		plugins.connectPhp.server({ base: serverRoot, port: 8010, keepalive: true});
	});

	// BrowserSync
	gulp.task('browserSync:php', ['php-server'], () => {
		browserSync.init({
			proxy: '127.0.0.1:8010',
			open: args.open ? 'local' : false,
			port: config.port || 3000
		});
	});

	// BrowserSync
	gulp.task('browserSync:html', () => {
		browserSync.init({
			open: args.open ? 'local' : false,
			port: config.port || 3000,
			server: {
				baseDir: './'+taskTarget,
			}
		});
	});
}
