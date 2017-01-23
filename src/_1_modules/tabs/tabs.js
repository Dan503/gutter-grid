
'use strict';

//npm imports
import $ from 'jquery';

//module imports
//import { example } from 'example/example';

const //hooks
	_module =  $('.JS-tabs'),
	_content = $('.JS-tabs__content'),
	_trigger = $('.JS-tabs__trigger');

const //classes
	active_ = '-active';

//module functionality
class tabs {
	constructor(elem){
		const This = this;
		this.elem = elem;
		this.$elem = $(elem);
		this.$triggers = this.$elem.find(_trigger);
		this.$content = this.$elem.find(_content);

		this.$triggers.click(function(e){
			e.preventDefault();
			This.switchTab($(this));
		});

		this.$content.filter(':first-child').show();
	}

	//Switches to the current tab
	switchTab(_this){
		const pos = _this.parent().index();

		this.$triggers.filter('.'+active_).removeClass(active_);
		_this.addClass(active_);

		this.$content.hide();
		this.$content.eq(pos).show();
	}
}

//This function is called on page load unless the name of this file starts with an underscore
export default function() {
	_module.each(function(e){
		new tabs(this);
	})
}
