'use strict';

import path from 'path';
import del from 'del';
import deleteEmpty from 'delete-empty';
import {
	gulp,
	plugins,
	args,
	config,
	dirs,
	taskTarget,
	browserSync,
} from '../config/shared-vars';

export default function () {
	let dirs = config.directories;

	// Clean
	gulp.task('clean', (done) => {
		var delDir = args.production ? dirs.destination : dirs.temporary;
		del.sync(delDir);
		deleteEmpty.sync(dirs.source + '/');
		done();
	});

	gulp.task('clean:livesite', del.bind(null, [path.join(dirs.destination)]));

	gulp.task(
		'clean:styles',
		del.bind(null, [path.join(dirs.temporary, 'styles')])
	);

	gulp.task(
		'clean:html',
		del.bind(null, [path.join(dirs.temporary, '**/*.html')])
	);

	gulp.task(
		'clean:scripts',
		del.bind(null, [path.join(dirs.temporary, 'scripts')])
	);

	gulp.task('clean:pages:empty', (done) => {
		let sources = [
			path.join(dirs.source, dirs.pages),
			path.join(dirs.temporary, dirs.pages),
		];

		const promises = sources.map((source) => {
			return new Promise((resolve) => {
				deleteEmpty(source, resolve);
			});
		});

		Promise.all(promises).then(() => {
			done();
		});
	});

	gulp.task(
		'clean:pages:indexes',
		del.bind(null, [
			path.join(dirs.source, dirs.pages, '**/index.pug'),
			path.join(dirs.temporary, dirs.pages, '**/*'),
		])
	);

	const clean_dynamic_assets = (done) => {
		del.sync([
			path.join(dirs.temporary, 'content.json'), //ensures the use of a fresh json content
			path.join(dirs.source, dirs.pages, '**/assets/**/*'),
			path.join(taskTarget, config.basePath, dirs.pages, '**/assets/**/*'),
		]);
		deleteEmpty.sync(path.join(taskTarget, config.basePath, dirs.pages));
		done();
	};

	gulp.task(
		'clean:pages:dynamic-assets',
		gulp.series('clean:pages:indexes', clean_dynamic_assets)
	);
}
