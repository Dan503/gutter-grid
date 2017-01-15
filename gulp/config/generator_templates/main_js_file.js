
import { dirs } from '../shared-vars';

//This file generates the main.js file
//To include js from the modules folder, simply remove the underscore from the front of it's file name.
//Restart the gulp watch command after renaming a file and then re-save the file to have it take effect
//Any scripts outside of the modules folder need to be added manually to the manualImports variable

export default function(localModules){

	let npmModules = {
		$ : 'jquery',
	}

	let manualImports = {
		//an example of a manually loaded script from the scripts folder
		//example : ['.', 'exampleFolder', 'examplefile'].join('/'),
	}

	function generateCode(type, modules){
		let returnVal = '';
		for (let variable in modules){
			let path = modules[variable];

			let code = {

				import : `import ${variable} from '${path}';`,

				call : `${variable}();`,
			}

			returnVal = `${returnVal}\n${code[type]}`;
		}
		return returnVal;
	}

	return `
'use strict';

//This file is generated using gulp.
//To edit this file, edit the main_js_file.js generator template in the gulp config folder

//import npm plugins
${generateCode( 'import', npmModules)}

//import the manual imports
${generateCode( 'import', manualImports)}

//import modules
${generateCode( 'import', localModules)}

$(() => {

//run manual Imports
${generateCode( 'call', manualImports)}

//run modules
${generateCode( 'call', localModules)}

$('html').addClass('js-loaded');

});

`;

}
