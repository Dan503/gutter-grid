import $ from 'jquery';

//Code for tracking Google Analytics events
export default function GA_trackEvent(...values) {
	//".replace(/(\r\n|\n|\r)/gm,"")" removes any line breaks
	const trim = (value) => value.replace(/(\r\n|\n|\r)/gm, ' ').trim();
	const trimmed = $.map(values, (value) => trim(value));

	if (typeof ga !== 'undefined') {
		ga('send', 'event', ...trimmed);
	} else {
		const types = ['*category', '*action', 'label', 'value'];
		let objectified = {};
		$.each(types, (i, type) => {
			objectified[type] = trimmed[i];
		});

		console.log('GA event =', objectified, '* = required');
	}
}
