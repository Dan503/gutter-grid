'use strict';

// easily call functions after the user has finished resizing the screen
// use like this:
// onResizeStop(functionName, agument1, agument2, agument3, ...etc)

import $ from 'jquery';

let functions = [];

$(window).resize(function(e){
	clearTimeout(window.resizeFinished);
  window.resizeFinished = setTimeout(function(){
  	functions.forEach(func => func.fn.call(func._this || this, ...func.args));
  }, 250);
});

export default function onResizeStop(fn, _this, ...args){
	functions.push({fn, _this, args});
}

