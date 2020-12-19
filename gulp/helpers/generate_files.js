import path from 'path';
import vsource from 'vinyl-source-stream';
import { applyDefaults } from 'default-to';

import { gulp, dirs, plugins, join } from '../config/shared-vars';

import { is_array } from './php-to-js-translators';

export default function generate_files(
	spec = {},
	intro = 'Generated these files:'
) {
	console.log(plugins.util.colors.bold('\n' + intro));

	function generate(spec = {}) {
		applyDefaults(spec, {
			dest: `./${dirs.source}`,
			fileName: 'file.txt',
			content: '',
			message: 'default',
			callback: false,
		});

		const isJSON = path.extname(spec.fileName) === '.json';

		if (isJSON && typeof spec.content !== 'string') {
			//stringify the content if object passed in
			spec.content = JSON.stringify(spec.content);
		}

		//Determines what the file name should be
		var stream = vsource(spec.fileName);

		//generates the page content
		stream.end(spec.content);

		if (isJSON) {
			//prettifies json files automatically
			stream.pipe(plugins.jsonFormat(2));
		}

		//generates the page file
		stream.pipe(gulp.dest(spec.dest));

		//Tells you what pages have been generated and where to find them
		if (spec.message === 'default') {
			console.log(
				` - ${spec.dest.replace(/\\/g, '/')}/${plugins.util.colors.yellow(
					spec.fileName
				)}`.replace(/\/\//g, '/')
			);
		} else if (spec.message) {
			console.log(spec.message);
		}

		if (spec.callback) spec.callback.call(this);
	}

	if (Array.isArray(spec)) {
		spec.forEach((thisSpec) => {
			//console.log(thisSpec);
			generate(thisSpec);
		});
	} else {
		generate(spec);
	}

	//empty line for breathing room
	console.log('');
}
