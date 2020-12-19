'use strict';

//npm imports
import $ from 'jquery';

//module imports
//import { example } from 'example/example';

const //hooks
	_module = $('.JS-svg'),
	_target = $('.JS-svg__target'),
	_trigger = $('.JS-svg__trigger');

const //classes
	open_ = '-svg--open';

//module functionality
class svg {
	constructor(elem) {
		const This = this;
		this.elem = elem;
		this.$elem = $(elem);

		this.$elem.find(_trigger).click(function (e) {
			e.preventDefault();
			//This.exampleMethod($(this));
		});
	}

	//Description for example function
	exampleMethod(_this) {
		//_this.doStuff();
	}
}

//This function is called on page load unless the name of this file starts with an underscore
export default function () {
	console.log('The svg module javascript has loaded');

	_module.each(function (e) {
		new svg(this);
	});
}
