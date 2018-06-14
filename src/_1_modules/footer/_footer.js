
'use strict';

//npm imports
import $ from 'jquery';

//module imports
//import { example } from 'example/example';

//module functionality
class footer {
	constructor(elem){
		const This = this;
		this.elem = elem;
		this.$elem = $(elem);
		this.$trigger = this.$elem.find('.JS-footer__trigger');
		this.$target = this.$elem.find('.JS-footer__target');

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
	console.log('The footer module javascript has loaded');

	$('.JS-footer').each(function(e){
		new footer(this);
	})
}
