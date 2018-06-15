
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

			if (isNext){
				this.tabs.switchTo(this.index + 1, false);
			} else if (isPrev) {
				this.tabs.switchTo(this.index - 1, false);
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
		this.deactivate_others();
		this.$trigger
			.addClass(this.activeClass)
			.attr('tabindex', 0)
			.attr('aria-selected', 'true');
		this.$content.show();

		if (!isRemote){
			this.$trigger.focus();
		}

		if (!this.getStorage() || this.tabs.is_defaultSwitcher){
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
	deactivate_others(){
		$.each(this.tabs.triggers, (i, trigger) => {
			if (trigger !== this) {
				trigger.deactivate();
			}
		})
	}
	signal(){
		Emitter.emit('systemSwitch--external', this.name);
	}
	getStorage(){
		return localStorage.getItem('activeTab');
	}
	getNext(){
		return this.tabs[this.index + 1];;
	}
	getPrev(){
		return this.tabs[this.index - 1];
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

		Emitter.on('systemSwitch', name => this.switchTo(name));

	}

	//Switches to the defined tab
	switchTo(nameOrIndex, isRemote = true){

		$.each(this.triggers, (i, trigger) => {
			if (
				trigger.name === nameOrIndex ||
				trigger.index === nameOrIndex
			) {
				trigger.activate(isRemote);
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