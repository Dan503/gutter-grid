import $ from 'jquery';

//JS-utilities
import defaultTo from 'default-to';

//function used to only trigger code when an element has loaded onto the page
//excellent for ajax related content

export default function(element, callback, settings){
	settings = defaultTo(settings, {
		timeout : 5000,//5 seconds
		loopTime : 10,//delay between checks
		onFail : function(){}
	});

	var currentTime = 0;
	var selector = 	element.selector || element;

	var interval = setInterval(function(){
		check_for_element();
		currentTime = currentTime + settings.loopTime;
	}, settings.loopTime);

	function check_for_element(){
		//element found successfully
		if ($(selector).length){
			clearInterval(interval);
			callback.call($(selector));

		//element not found within timeout time
		} else if (currentTime >= settings.timeout){
			clearInterval(interval);
			settings.onFail.call($(selector));
			throw "Error: " + selector + " was not found or failed to load.";
		};
	};

	check_for_element();

	return $(selector);
}