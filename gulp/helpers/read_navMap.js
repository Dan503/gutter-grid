import { applyDefaults, defaultTo } from 'default-to';

import { dirs, basePath } from '../config/shared-vars';
import {
	navMap_pre_defaults,
	defaultTemplate,
} from '../config/navMap-user-defaults';
import generateFolderName from './generateFolderName';

import { siteData } from './generate_data';

let isLast = true;

//function for reading every item in the nav map
export default function read_navMap(map, index, callback, settings = {}) {
	applyDefaults(settings, {
		basePath: [dirs.source, dirs.pages].join('/') + '/',
		parent: siteData.navMap,
		location: [index],
	});

	if (settings.parent.subnav.length !== index + 1) {
		isLast = false;
	}

	// applies the pre-defaults settings
	let preDefaults = navMap_pre_defaults(map, index, settings.parent);
	applyDefaults(map, preDefaults);

	var folderName = generateFolderName(index, map.title);

	var recursivePath = settings.basePath + folderName + '/';

	settings.parent.subTemplate = defaultTo(
		settings.parent.subTemplate,
		defaultTemplate
	);

	map.location = settings.location;

	applyDefaults(map, {
		template: settings.parent.subTemplate,
		subTemplate: defaultTemplate,
		pageLocation: recursivePath,
		path: basePath + recursivePath.substr([dirs.source].join('/').length),
		templateListItem: false,
	});

	let hasSubnav = typeof map.subnav !== 'undefined';

	if (hasSubnav) isLast = false;

	callback.call(this, map, index, settings.parent, isLast);

	//if a subnav exists in item, generate defaults for it
	if (hasSubnav) {
		map.subnav.forEach((subMap, subIndex) => {
			var locationCopy = settings.location.slice(0);
			locationCopy.push(subIndex);

			read_navMap(subMap, subIndex, callback, {
				basePath: recursivePath,
				parent: map,
				location: locationCopy,
			});
		});
	}
}
