'use strict';

import {
	gulp,
	plugins,
	args,
	config,
	dirs,
	entries,
	taskTarget,
	browserSync,
	jsWatch,
} from '../config/shared-vars';

import path, { resolve } from 'path';
import vsource from 'vinyl-source-stream';
import { applyDefaults } from 'default-to';
import { is_array, in_array } from '../helpers/php-to-js-translators';
import generate_files from '../helpers/generate_files';

import valueAt from '../../JS-utilities/valueAt';
import module_sass_file from '../config/generator_templates/module_sass_file.js';
import module_js_file from '../config/generator_templates/module_js_file.js';
import module_pug_file from '../config/generator_templates/module_pug_file.js';
import template_pug_file from '../config/generator_templates/template_pug_file.js';
import layout_pug_file from '../config/generator_templates/layout_pug_file.js';
import waitForFile from '../helpers/waitForFile.js';

import './watch';
import { scripts_task } from './scripts';

//retrieves the list of --args
let names = Object.keys(args);

let keywords = ['_', 'open', 'production', 'js', 'export', 'debug'];

keywords.forEach((word) => {
	//removes the keywords from the argument list leaving only the name arguments behind
	names = names.filter((x) => x !== word);
});

function generate(type) {
	return gulp.series(
		((done) => {
			jsWatch.isEnabled = true;

			let files = [];
			let gen = {};
			let rootDest = dirs.source;

			function getFilePath(name) {
				const pathArray = name.split('/');
				const filePath = name;
				const fileName = valueAt(pathArray, -1);

				return { filePath, fileName };
			}

			names.forEach((name, i) => {
				gen = {
					module() {
						const path = getFilePath(name);

						const dest = `${rootDest}/${dirs.modules}/${path.filePath}`;

						return [
							{
								fileName: `${path.fileName}.scss`,
								content: module_sass_file(path.fileName),
								dest,
							},
							{
								fileName: (args.js ? '' : '_') + `${path.fileName}.js`,
								content: module_js_file(path.fileName),
								dest,
							},
							{
								fileName: `${path.fileName}.pug`,
								content: module_pug_file(path.fileName),
								dest,
							},
						];
					},

					template() {
						return [
							{
								fileName: `${name}.pug`,
								content: template_pug_file(name),
								dest: `${rootDest}/${dirs.templates}`,
							},
						];
					},

					layout() {
						return [
							{
								fileName: `${name}.pug`,
								content: layout_pug_file(name),
								dest: `${rootDest}/${dirs.layouts}`,
							},
						];
					},

					//for generating both a template and a layout at the same time
					tempLayout() {
						return [
							{
								fileName: `${name}.pug`,
								content: template_pug_file(name, name),
								dest: `${rootDest}/${dirs.templates}`,
							},
							{
								fileName: `${name}.pug`,
								content: layout_pug_file(name),
								dest: `${rootDest}/${dirs.layouts}`,
							},
						];
					},
				};

				gen[type]().forEach((file) => {
					files.push(file);
				});
			});

			generate_files(files);

			//just to generate space
			console.log('');

			if (names.length === 1)
				console.log(
					`You can create multiple ${type}s by stringing them together like this:
	${plugins.util.colors.green(`gulp new:${type} --${type}1 --${type}2`)}`
				);

			//starts pug task if generating a new template so it is added to the template list
			if (in_array(type, ['template', 'tempLayout'])) {
				console.log(
					plugins.util.colors.yellow.bold(
						'\n  Recompiling Pug to add the new template to the template list...\n'
					)
				);
				gulp.series('pug')(done);
			}

			if (type === 'module') {
				const path = getFilePath(names[0]);
				waitForFile(
					`${rootDest}/${dirs.modules}/${path.filePath}/${
						args.js ? path.fileName : '_' + path.fileName
					}.js`,
					() => {
						if (args.js) {
							//scripts task is run to ensure that the js is connected straight away
							gulp.series(scripts_task)(done);
						} else {
							gulp.parallel(scripts_task, 'watch')(done);
						}
					}
				);
			} else {
				setTimeout(() => {
					//new modules are instantly connected up to the watch function
					gulp.series('watch')(done);
				}, 500);
			}
		},
		() => {
			//new modules are instantly connected up to the watch function
			if (type === 'module' && args.js) {
				//scripts task is run to ensure that the js is connected straight away
				return gulp.series(scripts_task, 'watch');
			} else {
				return gulp.series('watch');
			}
		})
	);
}

gulp.task('new:module', () => {
	generate('module');
});

gulp.task('new:template', () => {
	generate('template');
});

gulp.task('new:layout', () => {
	generate('layout');
});

//generate templates and layouts at the same time
gulp.task('new:tempLayout', () => {
	generate('tempLayout');
});
