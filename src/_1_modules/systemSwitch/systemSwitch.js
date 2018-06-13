
'use strict';

//npm imports
import $ from 'jquery';
import Emitter from 'tiny-emitter/instance';

class systemSwitch__trigger {
	constructor(trigger){
		this.$trigger = $(trigger);
		this.name = this.$trigger.siblings().text().toLowerCase();

		this.$trigger.change(()=> {
			this.signal();
		});
	}
	signal(){
		console.log('systemSwitch Signal sent out');
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

		console.log('systemSwitch--external--subscribe')

		Emitter.on('systemSwitch--external', name => {
			this.switchTo(name)
		});
	}

	switchTo(name){
		console.log('external activate');
		$.each(this.triggers, (i,trigger) => {
			if (trigger.name === name && !trigger.isChecked()){
				trigger.activate();
			}
		})
	}
}

//This function is called on page load unless the name of this file starts with an underscore
export default function() {
	$('.JS-systemSwitch').each(function(e){
		new systemSwitch(this);
	})
}
