
//This file controls what goes into the moduleName.js files that are generated from using the "gulp new:module --moduleName" command

export default function(moduleName){
	return `
'use strict';

//npm imports
import $ from 'jquery';

//module imports
//import { example } from 'example/example';

//module functionality
class ${moduleName} {
	constructor(elem){
		const This = this;
		this.elem = elem;
		this.$elem = $(elem);
		this.$trigger = this.$elem.find('.JS-${moduleName}__trigger');
		this.$target = this.$elem.find('.JS-${moduleName}__target');

		this.openClass = '-open';

		this.$trigger.click(function(e){
			e.preventDefault();
			//This.exampleMethod();
		})
	}

	//Description for example function
	exampleMethod(){
		//this.$target.doStuff();
	}
}

//This function is called on page load unless the name of this file starts with an underscore
export default function() {
	console.log('The ${moduleName} module javascript has loaded');

	$('.JS-${moduleName}').each(function(e){
		new ${moduleName}(this);
	})
}
`;
}
