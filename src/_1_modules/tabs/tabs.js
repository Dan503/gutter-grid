
'use strict';

//npm imports
import $ from 'jquery';

//module imports
//import { example } from 'example/example';

const //hooks
	_module =  $('.JS-tabs'),
	_target = $('.JS-tabs__target'),
	_trigger = $('.JS-tabs__trigger');

const //classes
	open_ = '-tabs--open';

//module functionality
class tabs {
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
	console.log('The tabs module javascript has loaded');

	_module.each(function(e){
		new tabs(this);
	})
}
