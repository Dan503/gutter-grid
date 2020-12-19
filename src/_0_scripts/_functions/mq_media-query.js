'use strict';

import $ from 'jquery';
import bp from '_config/bp_break-points';

//designed to be used in an if statement like:
// works with the bp breakpoint object /_scripts/config/bp-break-points.js
//if (mq.min(bp('tablet') + 50){ ...functionality... }
//if (mq.inside('tablet', 'mobile'){ ...functionality... }

//Checks if the size is a valid breakpoint value
function checkBP(size) {
	if (typeof size === 'string') {
		if (typeof bp[size] !== 'undefined') {
			return bp[size];
		} else {
			console.log('Available Breakpoints:', bp);
			throw `"${size}" breakpoint does not exist`;
		}
	} else if (typeof size === 'number') {
		return size;
	} else {
		console.log(size);
		throw `"${size}" is not a valid breakpoint.\n It must be a string or a number`;
	}
}

const mq = {
	min(size) {
		let screen_width = $(window).width();
		size = checkBP(size);
		return screen_width > size + 1;
	},

	max(size) {
		let screen_width = $(window).width();
		size = checkBP(size);
		return screen_width < size;
	},

	inside(wideSize, thinSize) {
		let screen_width = $(window).width();
		wideSize = checkBP(wideSize);
		thinSize = checkBP(thinSize);
		return thinSize + 1 < screen_width && screen_width < wideSize;
	},

	outside(wideSize, thinSize) {
		return !mq.inside(wideSize, thinSize);
	},
};

export default mq;
