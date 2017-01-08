/**********************************************************************************\
	open PDFs, docs, external site links (start with http://), etc in a new window
\**********************************************************************************/

//Now includes google analytics integration

'use strict';

import $ from 'jquery';

import GA_trackEvent from '_functions/GA_trackEvent';

export default function() {

	var file_types = ['pdf','doc','docx','xls','xlsx','ppt','pptx','txt','mp3'];
	var image_types = ['jpg','gif','png'];

	$('a:not([href^="javascript"])').each(function(i){
		var href = $(this).attr('href');

		if (typeof href !== 'undefined'){
		//for download links and image links
			var file_type = href.substr((href.lastIndexOf('.') +1)).toLowerCase();

			//if file type is in the accepted list of file types...
			if ($.inArray(file_type,file_types) > -1){
				$(this).addClass('JS-downloadLink').addClass('JS-downloadLink--'+file_type);

			//if file type is an image and is on a touch device
			} else if ($.inArray(file_type,image_types) > -1 && $('html').hasClass('touch')){
				$(this).addClass('JS-imageLink');
			};

			if (href.match(/^mailto:[^?]*?@/)){
				$(this).addClass('JS-emailLink')
			}

		//podcast link
			if (href.match(/^http:\/\/www.itunes.com/)){
				$(this).addClass('podcastLink');
			};

		//External links
			if (
				href.match(/^http/) &&
				href.indexOf(window.location.host) === -1 &&
				!$(this).hasClass('JS-share__link') &&
				!$(this).hasClass('JS-podcastLink') &&

				//add data-jshook="newWindow__exclusion" to an external link to prevent it opening in a new window
				!$(this).hasClass('JS-newWindow__exclusion')
			){
				$(this).addClass('JS-externalLink');
			};

		};

		//once all links have been processed
		if (i == $('a:not([href^="javascript"])').length - 1){
			//any specific new window links get listed here
			var all_new_window_links = '.JS-downloadLink, .JS-imageLink, .JS-externalLink, .JS-podcastLink';

			//Google analytics download tracking
			$('body').on('click','.JS-downloadLink', function(){
				var url = $(this).attr('href');
				var classStart = 'JS-downloadLink--';
				var self = $(this);
				var text = self.text();

				$.each(file_types, function(i){
					var extension = file_types[i];
					if (self.hasClass(classStart+extension)) {
						GA_trackEvent('Download - ' + extension, 'click', text + ' | ' + url);
					}
				});
			});

			//Google analytics external link tracking
			$('body').on('click','.JS-externalLink', function(){
				var url = $(this).attr('href');
				GA_trackEvent('Outbound', 'click', url);
			});

			//Google analytics external link tracking
			$('body').on('click','.JS-podcastLink', function(){
				var url = $(this).attr('href');
				GA_trackEvent('Podcast', 'click', url);
			});

			$('body').on('click','.JS-emailLink', function(){
				var url = $(this).attr('href');
				GA_trackEvent('email contact', 'click', url);
			});


			$(all_new_window_links).addClass("JS-newWindow");

			$('body').on('click', all_new_window_links, function(e){
				//return false; //uncomment to help with testing so you don't get redirected while testing GA code.
				e.preventDefault();
				window.open($(this).attr('href'));
			})
		}
	});
}
