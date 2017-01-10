'use strict';

import path from 'path';
import { gulp, plugins, args, config, dirs, taskTarget } from '../config/shared-vars';

import waitForFile from '../helpers/waitForFile';

export default function (){

	// For doing full asset exports
	gulp.task('export', ()=>{
		args.production = true;
		gulp.start('build');

		const scriptsFolder = [taskTarget, config.basePath, dirs.assets, dirs.scripts.replace(/_[0-9]_/, '')].join('/');
		waitForFile([scriptsFolder, 'modernizr.min.js'].join('/'), ()=>{
			console.log(`\nFront end assets exported to:`);
			config.exportLocations.forEach(location => {
				//adding "\\" to the front of the string leaves it out of the copy as if you commented the line out
				if (location.indexOf('\\') === 0){
					gulp.src([taskTarget, config.basePath, dirs.assets, '**/*'].join('/'))
						.pipe(gulp.dest(location));

					console.log(` - "${location}"`);
				}
			})
		});
	});

}
