'use strict';

import {
	gulp,
	plugins,
	args,
	config,
	dirs,
	taskTarget,
	join,
} from '../config/shared-vars';

import waitForFile from './waitForFile';

//for exporting individual assets as you work
export default function exportAsset({
	file,
	path,
	notify = true,
	icons = false,
}) {
	if (args.export) {
		file = file.replace('.scss', '.css');
		path = path.replace(/_([0-9]_)?/, '');
		const sourceFile = [taskTarget, dirs.assets, path, file].join('/');
		waitForFile(sourceFile, { notify: false }, () => {
			if (notify)
				console.log(
					`\n${[path, plugins.util.colors.yellow(file)].join('/')} ${
						icons ? 'and icons ' : ''
					}exported to:`
				);
			config.exportLocations.forEach((location) => {
				gulp
					.src([sourceFile, sourceFile + '.map'])
					.pipe(gulp.dest([location, path].join('/')));

				if (icons) {
					let iconDest = [location, dirs.icons.replace('_', '')].join('/');
					gulp
						.src([dirs.source, dirs.icons, '/**/*'].join('/'))
						.pipe(gulp.dest(iconDest));
				}

				if (notify) console.log(` - "${location}"`);
			});
			if (notify) console.log('');
		});
	}
}
