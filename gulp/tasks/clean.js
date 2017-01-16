'use strict';

import path from 'path';
import del from 'del';
import deleteEmpty from 'delete-empty';
import { gulp, plugins, args, config, dirs, taskTarget, browserSync } from '../config/shared-vars';

export default function() {
	let dirs = config.directories;

	// Clean
	gulp.task('clean', ()=>{
		var delDir = args.production ? dirs.destination : dirs.temporary;
		del.sync(delDir);
		deleteEmpty.sync(dirs.source+'/');
	});

	gulp.task('clean:livesite', del.bind(null, [
		path.join(dirs.destination),
	]));

	gulp.task('clean:styles', del.bind(null, [
		path.join(dirs.temporary,'styles'),
	]));

	gulp.task('clean:html', del.bind(null, [
		path.join(dirs.temporary,'**/*.html'),
	]));

	gulp.task('clean:scripts', del.bind(null, [
		path.join(dirs.temporary,'scripts'),
	]));

	gulp.task('clean:pages:empty', ()=>{
		let sources = [
			path.join(dirs.source, dirs.pages),
			path.join(dirs.temporary, dirs.pages),
		];

		sources.forEach((source) => {
			deleteEmpty(source, ()=>{});
		})
	});

	gulp.task('clean:pages:indexes', del.bind(null, [
		path.join(dirs.source, dirs.pages,'**/index.pug'),
		path.join(dirs.temporary, dirs.pages, '**/*'),
	]));

	gulp.task('clean:pages:dynamic-assets', ['clean:pages:indexes'], ()=> {
		del.sync([
			path.join(dirs.temporary, 'content.json'),//ensures the use of a fresh json content
			path.join(dirs.source, dirs.pages,'**/assets/**/*'),
			path.join(taskTarget, config.basePath, dirs.pages,'**/assets/**/*'),
		]);
		deleteEmpty.sync(path.join(taskTarget, config.basePath, dirs.pages));
	});
}
