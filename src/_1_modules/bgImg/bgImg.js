
'use strict';

//npm imports
import $ from 'jquery';

//module imports
//import { example } from 'example/example';

const //hooks
	_module =  $('.JS-bgImg');

//Module functionality
class bgImg {
	constructor(elem){
		this.$elem = $(elem);
		this.src = this.$elem.find('> img').attr('src');

		console.log(Modernizr);

		if (!Modernizr.objectfit) this.applyBG();
	}

	//Applies the image as a background image
	applyBG(){
		this.$elem
			.css('background-image',`url(${this.src})`)
			.find('> img').addClass('TK-visHid');
	}
}

//This function is called on page load unless the name of this file starts with an underscore
export default function() {
	_module.each(function(e){
		new bgImg(this);
	})
}
