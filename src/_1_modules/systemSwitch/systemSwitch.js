
'use strict';

//npm imports
import $ from 'jquery';
import Emitter from 'tiny-emitter/instance';

//forcing tabs code to initialise before systemSwitch code
import { tabs_on_page_load } from '../tabs/_tabs';

//This function is called on page load unless the name of this file starts with an underscore
export default function() {

	class systemSwitch__trigger {
		constructor(trigger){
			this.$trigger = $(trigger);
			this.name = this.$trigger.siblings().text().toLowerCase();

			if (this.isChecked()){
				this.signal();
			}

			this.$trigger.change(()=> {
				this.signal();
			});
		}

		signal(){
			Emitter.emit('systemSwitch',this.name);
		}

		activate(){
			this.$trigger[0].checked = true;
			this.signal();
		}

		isChecked(){
			return this.$trigger[0].checked;
		}
	}

	//module functionality
	class systemSwitch {
		constructor(elem){
			const This = this;
			this.elem = elem;
			this.$elem = $(elem);
			this.$triggers = this.$elem.find('.JS-systemSwitch__trigger');
			this.triggers = [];

			this.$triggers.each((i,v)=>{
				this.triggers.push(new systemSwitch__trigger(v));
			})

			Emitter.on('systemSwitch--external', name => {
				this.switchTo(name)
			});
		}

		switchTo(name){
			$.each(this.triggers, (i,trigger) => {
				if (trigger.name === name && !trigger.isChecked()){
					trigger.activate();
				}
			})
		}
	}

	tabs_on_page_load();

	$('.JS-systemSwitch').each(function(e){
		new systemSwitch(this);
	})
}
