//applies -scrollDirection-down and -scrollDirection-up classes when scrolling

import $ from 'jquery';

const //hooks
	_target = $('body');

const //classes
	scrolling_down_ = '-scrollDirection--down',
	scrolling_up_ = '-scrollDirection--up';

export default function () {
	let currentPos = window.pageYOffset;
	_target.addClass(scrolling_up_);

	$(window).scroll(function (e) {
		let newPos = window.pageYOffset;
		if (currentPos < newPos) {
			if (_target.hasClass(scrolling_up_)) {
				_target.addClass(scrolling_down_).removeClass(scrolling_up_);
			}
		} else if (_target.hasClass(scrolling_down_)) {
			_target.addClass(scrolling_up_).removeClass(scrolling_down_);
		}
		currentPos = window.pageYOffset;
	});
}
