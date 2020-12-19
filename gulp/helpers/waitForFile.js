import fs from 'fs';
import { applyDefaults } from 'default-to';
import { is_string, is_array, is_object, isset } from './php-to-js-translators';
import { gulp, plugins, join } from '../config/shared-vars';

//Waits for a file or folder to exist before running a function or task(s)
//The more specific you are, the more accurate the function is
export default function waitForFile(path, settings = {}, callback = () => {}) {
	//if putting the function in the settings slot...
	if (typeof settings === 'function') {
		callback = settings;
		settings = {};
	}

	applyDefaults(settings, {
		timeout: 60000, //Will wait 60 seconds before declaring a file as missing
		loopTime: 100, //Will check if the file exists every 100 milliseconds
		delay: 500, //Will wait an extra 500 milliseconds before running the task/function in an effort to ensure all of the relevant files exist
		onFail: function () {},
		notify: true,
	});

	if (settings.notify)
		console.log(plugins.util.colors.yellow('Waiting for:'), path);

	var currentTime = 0;

	var interval = setInterval(() => {
		fs.stat(path, function (err, stat) {
			if (err == null) {
				if (settings.notify)
					console.log(plugins.util.colors.green('Found:'), path);
				clearInterval(interval);
				//one final timout to ensure all the files are in position before initiating the code
				setTimeout(() => {
					callback();
				}, settings.delay);
				return true;
			} else if (currentTime >= settings.timeout) {
				clearInterval(interval);
				settings.onFail.call();
				console.log(
					plugins.util.colors.red.bold('Error:'),
					path + ' was not found'
				);
				return false;
			}
		});

		currentTime = currentTime + settings.loopTime;
	}, settings.loopTime);
}
