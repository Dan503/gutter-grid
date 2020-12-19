'use strict';

//npm imports
import $ from 'jquery';

//module imports
//import { example } from 'example/example';

const //hooks
	_module = $('.JS-accordion'),
	_revealer = $('.JS-accordion__revealer'),
	_toggle = $('.JS-accordion__toggle');

const //classes
	open_ = '-accordion--open';

//module functionality
class accordion {
	constructor(elem) {
		const This = this;
		this.elem = elem;
		this.$elem = $(elem);
		this.$toggle = this.$elem.find(_toggle);
		this.$revealer = this.$elem.find(_revealer);
		this.isOpen = false;

		this.$toggle.click((e) => {
			e.preventDefault();
			this.toggle();
		});
	}

	//toggles accordion open and closed
	toggle() {
		this.isOpen = !this.isOpen;
		this.$revealer.slideToggle();
		this.$elem.toggleClass(open_);
		this.$toggle.attr('aria-expanded', this.isOpen);
	}
}

//This function is called on page load unless the name of this file starts with an underscore
export default function () {
	_module.each(function (e) {
		new accordion(this);
	});
}
