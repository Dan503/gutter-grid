
'use strict';

//npm imports
import $ from 'jquery';
import defaultTo from 'default-to';

//scripts imports
import GA_trackEvent from '_functions/GA_trackEvent';

const //hooks
	_link = $('.JS-share__link');

const //other variables
	titleText = $('head title').text(),
	pageTitle = titleText.split(' |')[0];

const
	window_settings = {

		twitter : {
			window_name : 'Share on Twitter',
			height: 260,
			ga: 'Twitter share'
		},

		facebook : {
			window_name : 'Share on Facebook',
			height: 400,
			ga: 'Facebook share'
		},

		linkedin : {
			window_name : 'Share on LinkedIn',
			width : 520,
			height: 570,
			ga: 'LinkedIn share'
		},

		mail : {
			openWindow: false,
			ga: 'Email share'
		}
	};


//module functionality
class share__window {

	constructor(_thisLink, e){
		this.url = _thisLink.attr('href');
		this.e = e;

		let shareType;

		if(this.url.indexOf('twitter') > -1){
			shareType = 'twitter';
		} else if (this.url.indexOf('facebook') > -1){
			shareType = 'facebook';
		} else if (this.url.indexOf('linkedin') > -1){
			shareType = 'linkedin';
		} else if (this.url.indexOf('mailto') > -1){
			shareType = 'mail';
		}

		this.openWindow(window_settings[shareType])
	}

	openWindow(settings){

		settings = defaultTo(settings, {
			window_name : 'Share',
			height : 600,
			width : 600,
			ga: 'Share link clicked',
			openWindow : true,
		});

		//triggers Google analytics tracking
		GA_trackEvent(settings.ga, 'click', pageTitle);

		if (settings.openWindow){

			this.e.preventDefault();

			// Fixes dual-screen position for most browsers except Firefox
			var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
			var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

			var w = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
			var h = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

			var left = ((w / 2) - (settings.width / 2)) + dualScreenLeft;
			var top = ((h / 2) - (settings.height / 2)) + dualScreenTop;

			//Opens share links in a new window
			window.open(this.url, settings.window_name, 'scrollbars=yes, width=' + settings.width + ', height=' + settings.height + ', top=' + top + ', left=' + left);
		}
	}
}

//This function is called on page load unless the name of this file starts with an underscore
export default function() {
	_link.click(function(e){
		new share__window($(this), e);
	});
}
