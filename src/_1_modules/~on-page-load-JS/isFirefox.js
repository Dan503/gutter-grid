import $ from 'jquery';

var isFirefox = window.navigator.userAgent.match(/Firefox/i);

export default function () {
	if (isFirefox) $('html').addClass('firefox');
}

export { isFirefox };
