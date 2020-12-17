'use strict';

import {
	gulp,
	plugins,
	args,
	config,
	dirs,
	taskTarget,
	browserSync,
	notification_icon_location,
	jsWatch,
} from '../config/shared-vars';

import path from 'path';
import glob from 'glob';
import browserify from 'browserify';
import watchify from 'watchify';
import envify from 'envify';
import babelify from 'babelify';
import _ from 'lodash';
import dir from 'node-dir';
import vsource from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import notifier from 'node-notifier';

import generate_files from '../helpers/generate_files';
import exportAsset from '../helpers/exportAsset';

import valueAt from '../../JS-utilities/valueAt';

//main js file generator template
import main_js_file from '../config/generator_templates/main_js_file';

let entries = config.entries;

let browserifyTask = (files) => {
	return files.map((entry) => {
		let dest = path.resolve(taskTarget, config.basePath);

		// Options
		let customOpts = {
			entries: [entry],
			debug: true,
			transform: [
				babelify, // Enable ES6 features
				envify, // Sets NODE_ENV for better optimization of npm packages
			],
			//allows you to import scripts without defining the path to the modules or _0_scripts folder in the import statment
			paths: [
				'./node_modules',
				'./src/' + dirs.modules,
				'./src/' + dirs.scripts,
				'./' + dirs.jsUtils,
			],
		};

		let bundler = browserify(customOpts);

		if (jsWatch.isEnabled) {
			// Setup Watchify for faster builds
			let opts = _.assign({}, watchify.args, customOpts);
			bundler = watchify(browserify(opts));
		}

		let rebundle = function () {
			var hasError = false;
			let startTime = new Date().getTime();

			bundler
				.bundle()
				.on('error', function (err) {
					hasError = true;
					notifier.notify({
						title: 'Scripts error',
						message: err.message,
						icon: notification_icon_location + 'gulp-error.png',
					});
					console.log(
						`\n ${plugins.util.colors.red.bold(
							'JS failed to compile:'
						)} ${plugins.util.colors.yellow(err)}\n`
					);
					this.emit('end');
				})
				.pipe(vsource(entry))
				.pipe(buffer())
				.pipe(plugins.sourcemaps.init({ loadMaps: true }))
				.pipe(plugins.if(args.production, plugins.uglify()))
				.on('error', plugins.util.log)
				.pipe(
					plugins.rename(function (filepath) {
						// Remove 'source' directory as well as prefixed folder underscores
						// Ex: 'src/_0_scripts' --> '/scripts'
						//filepath.dirname = filepath.dirname.replace(dirs.source, '').replace('_', '');

						//Sends all output files to the scripts folder
						filepath.dirname = path.join(
							dirs.assets,
							dirs.scripts.replace(/^_[0-9]_/, '')
						);
					})
				)
				.pipe(plugins.sourcemaps.write('./'))
				.pipe(gulp.dest(dest))
				// Show which file was bundled and how long it took
				.on('end', function () {
					if (!hasError) {
						let time = (new Date().getTime() - startTime) / 1000;
						notifier.notify({
							title: 'Scripts',
							message: path.basename(entry) + ' compiled successfully',
							icon: notification_icon_location + 'gulp.png',
						});

						console.log(
							plugins.util.colors.cyan(entry) +
								' was browserified: ' +
								plugins.util.colors.magenta(time + 's')
						);

						const fileInfo = entry.split('\\');
						const file = valueAt(fileInfo, -1);
						const filePath = entry
							.replace(dirs.source, '')
							.replace(file, '')
							.replace(/^[\\]|[\\]$/g, '');

						if (args.export && file === entries.js)
							exportAsset({ file, path: filePath });

						return browserSync.reload('*.js');
					}
				});
		};

		if (jsWatch.isEnabled) {
			bundler.on('update', rebundle); // on any dep update, runs the bundler
			bundler.on('log', plugins.util.log); // output build logs to terminal
		}

		return rebundle();
	});
};

const run_file_generation = (done) => {
	var scriptDest = path.join('./', dirs.source, dirs.scripts, entries.js);
	var moduleFiles = {};

	dir.files(path.join('./', dirs.source, dirs.modules), function (err, files) {
		if (err) throw err;

		let jsFiles = files.filter(function (file) {
			return (
				file.indexOf('.js') > -1 && path.parse(file).name.substr(0, 1) !== '_'
			);
		});

		jsFiles.forEach((file, i) => {
			let modName = path.parse(file).name;
			moduleFiles[modName] = file
				.replace(/\\/g, '/')
				.replace(dirs.source, '..')
				.replace('.js', '');
		});

		return generate_files(
			{
				dest: scriptDest.replace(entries.js, ''),
				fileName: entries.js,
				content: main_js_file(moduleFiles),
				callback() {
					done();
					return browserifyTask([scriptDest]);
				},
			},
			plugins.util.colors.bold('\nGenerated the main.js file:')
		);
	});
};

const proto_only_browserify = () => {
	return browserifyTask([
		'./' + path.join(dirs.source, dirs.protoOnly, entries.protoOnly.js),
	]);
};

export const scripts_task = () =>
	gulp.parallel(run_file_generation, proto_only_browserify);

//Just an alternate way to call the "gulp scripts" task without me having to introduce a breaking change
gulp.task('js', gulp.series('copy:scripts', scripts_task));
