
'use strict';

//npm imports
import $ from 'jquery';

//script imports
import callPlayer from '_functions/callPlayer';
import GA_trackEvent from '_functions/GA_trackEvent';

//hooks
const _trigger = $('[data-yt-action]');

function controlVid(_this, callback){
	const callActions = {
		play : 'playVideo',
		pause : 'pauseVideo',
	};

	const actionData = _this.data('yt-action').split(' ');
	const action = actionData[0];
	const target = actionData[1] || _this.parent().find('iframe').attr('id');

	$(document).on('opened', '.remodal', function (e) {
		GA_trackEvent('Video view', 'click', window.location.hash);
	});

	callPlayer(target, callActions[action]);

	if (callback) callback.call($('#'+target));
}

//This function is called on page load unless the name of this file starts with an underscore
export default function() {

	_trigger.click(function(e){
		const _this = $(this);
		//e.preventDefault();
		controlVid(_this);
	});

}
