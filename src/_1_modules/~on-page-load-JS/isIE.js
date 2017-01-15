'use strict';

import $ from 'jquery';

var isIE = window.navigator.userAgent.match(/MSIE|Trident/);

export default function() {
	if(!Modernizr.flexbox && !Modernizr.flexwrap || isIE){
		//$('head').append('<script src="/assets/scripts/browser-hacks/flexibility.js"></script>');
		//flexibility(document.documentElement);

		if (isIE) {
			$('html').addClass('ie');
		}
	}
}

export { isIE };
