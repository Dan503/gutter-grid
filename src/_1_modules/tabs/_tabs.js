
'use strict';

//npm imports
import $ from 'jquery';
import Emitter from 'tiny-emitter/instance';

class tabs__trigger {
	constructor({trigger, index, tabs}){
		this.index = index;
		this.tabs = tabs;
		this.activeClass = '-active';

		this.$trigger = $(trigger);
		this.$content = this.tabs.$content.eq(index);

		this.name = this.$trigger.text().toLowerCase();

		this.$trigger.keyup(key => {
			const isKey = keys => keys.indexOf(key.which) > -1;
			const isNext = isKey([39]);
			const isPrev = isKey([37]);
			const isEnter = isKey([13]);

			if (isNext){
				this.tabs.switch_to(this.index + 1, false);
			} else if (isPrev) {
				this.tabs.switch_to(this.index - 1, false);
			} else if (isEnter) {
				key.preventDefault();
				this.set_focus();
			}
		})

		this.$trigger.click((e)=>{
			e.preventDefault();
			this.activate();

			if (this.tabs.is_defaultSwitcher) {
				this.signal();
			}
		});
	}
	activate(isRemote = true){
		this.tabs.deactivate_triggers();
		this.$trigger
			.addClass(this.activeClass)
			.attr('tabindex', 0)
			.attr('aria-selected', 'true');
		this.$content.show();

		if (!isRemote){
			this.$trigger.focus();
		}

		if (!this.get_storage() || this.tabs.is_defaultSwitcher){
			this.signal();
		}
	}
	deactivate(){
		this.$trigger
			.removeClass(this.activeClass)
			.attr('tabindex',-1)
			.attr('aria-selected', 'false');
		this.$content.hide();
	}
	signal(){
		Emitter.emit('systemSwitch--external', this.name);
	}
	get_storage(){
		return localStorage.getItem('activeTab');
	}
	set_focus(){
		this.$content.focus();
	}
}

//module functionality
class tabs {
	constructor(elem){
		const This = this;
		this.elem = elem;
		this.$elem = $(elem);
		this.$triggers = this.$elem.find('.JS-tabs__trigger');
		this.$content = this.$elem.find('.JS-tabs__content');
		this.is_defaultSwitcher = this.$elem.is('#JS-tabs__defaultSelector');

		this.triggers = [];
		this.$triggers.each((i,v)=>{
			this.triggers.push(new tabs__trigger({
				trigger: v,
				index: i,
				tabs: this
			}));
		});

		Emitter.on('systemSwitch', name => this.switch_to(name));

	}

	find_desired_trigger(nameOrIndex, cb){
		$.each(this.triggers, (i, trigger) => {
			if (
				trigger.name === nameOrIndex ||
				trigger.index === nameOrIndex
			) {
				cb.call(this, trigger, i);
			}
		})
	}

	//Switches to the defined tab
	switch_to(nameOrIndex, isRemote = true){
		this.find_desired_trigger(nameOrIndex, trigger => {
			trigger.activate(isRemote);
		})
	}

	deactivate_triggers(){
		$.each(this.triggers, (i, trigger) => {
			if (trigger !== this) {
				trigger.deactivate();
			}
		})
	}
}

let tabsList = [];

//This function is called on page load unless the name of this file starts with an underscore
function tabs_on_page_load () {
	$('.JS-tabs').each(function(e){
		tabsList.push(new tabs(this))
	})
}

export { tabsList, tabs_on_page_load };