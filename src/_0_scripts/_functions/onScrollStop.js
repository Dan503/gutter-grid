'use strict';

// easily call functions after the user has finished scrolling
// use like this:
// onScrollStop(functionName, agument1, agument2, agument3, ...etc)

import $ from 'jquery';

export default function onScrollStop(fn, ...args){
	$(window).scroll(function(e){
		clearTimeout(window.scrollFinished);
    window.scrollFinished = setTimeout(function(){
  		fn.call(this, ...args);
    }, 250);
	});
}

