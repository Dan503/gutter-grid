'use strict';

import gulp from 'gulp';
import modernizr from 'gulp-modernizr';
import uglify from 'gulp-uglify';

export default function() {
	let modernizr_settings = {
		options : [
	        "setClasses",
	        "html5printshiv",
	        "testProp",
	    ]
	}

	gulp.task('modernizr', function() {
	  gulp.src([
	  	'website-src/**/*.scss',
	  	'website/**/*.js',
	  	'*.scss'
	  ])
	    .pipe(modernizr('modernizr.min.js', modernizr_settings))
	    .pipe(uglify())
	    .pipe(gulp.dest('website/javascripts'));
	});
}
