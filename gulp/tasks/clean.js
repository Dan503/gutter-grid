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
	join,
} from '../config/shared-vars';

// Clean
gulp.task('clean', (done) => {
	var delDir = args.production ? dirs.destination : dirs.temporary;
	del.sync(delDir);
	deleteEmpty.sync(dirs.source + '/');
	done();
});

gulp.task('clean:livesite', del.bind(null, [join(dirs.destination)]));

gulp.task('clean:styles', del.bind(null, [join(dirs.temporary, 'styles')]));

gulp.task('clean:html', del.bind(null, [join(dirs.temporary, '**/*.html')]));

gulp.task('clean:scripts', del.bind(null, [join(dirs.temporary, 'scripts')]));

gulp.task('clean:pages:empty', (done) => {
	let sources = [
		join(dirs.source, dirs.pages),
		join(dirs.temporary, dirs.pages),
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
		join(dirs.source, dirs.pages, '**/index.pug'),
		join(dirs.temporary, dirs.pages, '**/*'),
	])
);

const clean_dynamic_assets = (done) => {
	del.sync([
		join(dirs.temporary, 'content.json'), //ensures the use of a fresh json content
		join(dirs.source, dirs.pages, '**/assets/**/*'),
		join(taskTarget, config.basePath, dirs.pages, '**/assets/**/*'),
	]);
	deleteEmpty.sync(join(taskTarget, config.basePath, dirs.pages));
	done();
};

gulp.task(
	'clean:pages:dynamic-assets',
	gulp.series('clean:pages:indexes', clean_dynamic_assets)
);
