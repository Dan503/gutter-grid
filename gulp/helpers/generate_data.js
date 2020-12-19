import { dirs, config, pjson, join } from '../config/shared-vars';

import fs from 'fs';
import path from 'path';
import foldero from 'foldero';

export default function generate_data() {
	let siteData = [];
	let finalData = {};

	//items lower in the list overwrite items higher in the list
	let dataPaths = [join(dirs.source, dirs.data)];

	dataPaths.forEach((path, i) => {
		if (fs.existsSync(path)) {
			let json = {};
			// Convert directory to JS Object

			siteData[i] = foldero(path, {
				recurse: true,
				whitelist: '(.*/)*.+.(json|ya?ml)$',
				loader: function loadAsString(file) {
					try {
						let ext = file.substr(file.lastIndexOf('.') + 1);
						if (ext === 'yaml' || ext === 'yml') {
							json = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
						} else {
							json = JSON.parse(fs.readFileSync(file, 'utf8'));
						}
					} catch (e) {
						console.log('Error Parsing JSON/YAML file: ' + file);
						console.log('==== Details Below ====');
						console.log(e);
					}
					return json;
				},
			});
		}
	});

	//merges site data and any other data folders in the dataPaths variable into a single js object
	siteData.forEach((data, i) => {
		for (var attrname in data) {
			finalData[attrname] = siteData[i][attrname];
		}
	});

	//gives pug templates access to the npm "require" function
	//if there are multiple exports though, to use the default export you need to do require('module-name').default
	finalData.require = require;

	finalData.pkg = pjson;
	return finalData;
}

let siteData = generate_data();

export { generate_data, siteData };
