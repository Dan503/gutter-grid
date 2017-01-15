'use strict';

import $ from 'jquery';

export default function(){

    let //hooks
    	_trigger = $('.JS-templateList__trigger'),
    	_link = $('.JS-templateList__link'),
    	_closer = $('.JS-templateList__closer'),
    	_target = $('.JS-templateList__target'),
    	_focus = $('.JS-templateList__target');

    function callTemplates(action, e){
		if(e) e.preventDefault();
    	let open = '-isOpen';
    	let actions = {
    		open(){
				_target.addClass(open);
				_focus.focus();
    		},
    		close(){
				_target.removeClass(open);
    		}
    	};
    	return actions[action]();
    }

	_trigger.click(function(e){
		callTemplates('open', e);
	});

	_link.click(function(e){
		e.stopPropagation();
	});

	_closer.click(function(e){
		callTemplates('close', e);
	});

	//if escape key pressed
	$('body').keyup(function(key){
		if (key.keyCode === 27){
			//close the templates list
			callTemplates('close');
		}
	});

}
