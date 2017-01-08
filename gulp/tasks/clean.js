'use strict';

import path from 'path';
import del from 'del';
import deleteEmpty from 'delete-empty';
import { gulp, plugins, args, config, dirs, taskTarget, browserSync } from '../config/shared-vars';

export default function() {
	let dirs = config.directories;

	// Clean
	gulp.task('clean', ()=>{
		del.sync([
			path.join(dirs.temporary),
			path.join(dirs.destination),
		]);
		deleteEmpty.sync(dirs.source+'/');
	});

	gulp.task('clean:styles', del.bind(null, [
		path.join(dirs.temporary,'styles'),
		path.join(dirs.destination,'styles')
	]));

	gulp.task('clean:html', del.bind(null, [
		path.join(dirs.temporary,'**/*.html'),
		path.join(dirs.destination,'**/*.html')
	]));

	gulp.task('clean:scripts', del.bind(null, [
		path.join(dirs.temporary,'scripts'),
		path.join(dirs.destination,'scripts')
	]));

	gulp.task('clean:pages:empty', ()=>{
		let sources = [
			path.join(dirs.source, dirs.pages),
			path.join(dirs.temporary, dirs.pages),
			path.join(dirs.destination, dirs.pages),
		];

		sources.forEach((source) => {
			deleteEmpty(source, ()=>{});
		})
	});

	gulp.task('clean:pages:indexes', del.bind(null, [
		path.join(dirs.source, dirs.pages,'**/index.pug'),
		path.join(dirs.temporary, dirs.pages, '**/*'),
		path.join(dirs.destination, dirs.pages, '**/*'),
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
