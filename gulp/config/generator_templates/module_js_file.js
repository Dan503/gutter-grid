
//This file controls what goes into the moduleName.js files that are generated from using the "gulp new:module --moduleName" command

export default function(moduleName){
	return `
'use strict';

//npm imports
import $ from 'jquery';

//module imports
//import { example } from 'example/example';

const //hooks
	_module =  $('.JS-${moduleName}'),
	_target = $('.JS-${moduleName}__target'),
	_trigger = $('.JS-${moduleName}__trigger');

const //classes
	open_ = '-${moduleName}--open';

//module functionality
class ${moduleName} {
	constructor(elem){
		const This = this;
		this.elem = elem;
		this.$elem = $(elem);

		this.$elem.find(_trigger).click(function(e){
			e.preventDefault();
			//This.exampleMethod($(this));
		})
	}

	//Description for example function
	exampleMethod(_this){
		//_this.doStuff();
	}
}

//This function is called on page load unless the name of this file starts with an underscore
export default function() {
	console.log('The ${moduleName} module javascript has loaded');

	_module.each(function(e){
		new ${moduleName}(this);
	})
}
`;
}
