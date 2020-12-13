import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSyncLib from 'browser-sync';
import pjson from '../../package.json';
import minimist from 'minimist';
import getDirectories from '../helpers/getDirectories';

let config = pjson.config;
//args.argName can be set to true by adding " --argName" when running console commands
let args = minimist(process.argv.slice(2));
let dirs = config.directories;
let entries = config.entries;

let taskTarget = args.production ? dirs.destination : dirs.temporary;

//__dirname is a global variable inherant to node.js
let notification_icon_location =
	__dirname + '/../../node_modules/gulp-notify/assets/';

// Load all gulp plugins based on their names
// EX: gulp-copy -> copy
const plugins = gulpLoadPlugins();

// Create a new browserSync instance
let browserSync = browserSyncLib.create();

var basePath = config.basePath.length > 0 ? '/' + config.basePath : '';

var validFileTypes = ['pdf', 'docx', 'doc', 'xls', 'xlsx', 'txt', 'rtf'];

//Gives access to the site break points
let bp = require([
	'..',
	'..',
	dirs.source,
	dirs.scripts,
	'_config',
	'bp_break-points.js',
].join('/'));

//Determines if browser should watch JS files for changes using watchify
//(I have to set it as an object in order to overide it)
let jsWatch = { isEnabled: false };

export {
	gulp,
	plugins,
	args,
	config,
	validFileTypes,
	basePath,
	pjson,
	dirs,
	entries,
	taskTarget,
	browserSync,
	notification_icon_location,
	bp,
	jsWatch,
};
