
'use strict';

//npm imports
import $ from 'jquery';

//module imports
//import { example } from 'example/example';

//module functionality
class viewGitHub {
	constructor(elem){
		const This = this;
		this.elem = elem;
		this.$elem = $(elem);
		this.$trigger = this.$elem.find('.JS-viewGitHub__trigger');
		this.$target = this.$elem.find('.JS-viewGitHub__target');

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
	console.log('The viewGitHub module javascript has loaded');

	$('.JS-viewGitHub').each(function(e){
		new viewGitHub(this);
	})
}
