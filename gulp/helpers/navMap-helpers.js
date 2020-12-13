import filesize from 'filesize';
import fs from 'fs';
import path from 'path';
import defaultTo from 'default-to';
import { dirs, config, validFileTypes, basePath } from '../config/shared-vars';
import {
	is_string,
	is_int,
	is_numeric,
	is_array,
	in_array,
	isset,
	end,
} from './php-to-js-translators';

//strips out any html tags found in a string
function stripTags(string) {
	return string.replace(/(<([^>]+)>)/gi, '');
}

//function that retrieves a map from the navMap variable based on the title attribute
//function not to be used in regular code
function getTitleMap(startMap, userSearchTerm, isRecursive) {
	var returnValue = false;
	var found = false;
	var isRecursive = defaultTo(isRecursive, true);

	function iterator(map, searchTerm) {
		for (var i = 0; i < map.length; i++) {
			var item = map[i];
			//removes any html in the strings before searching for a match
			var itemTitle = stripTags(item.title).toLowerCase();
			var providedTitle = stripTags(searchTerm).toLowerCase();

			//also converts strings to lowercase so they aren't case sensitive
			if (itemTitle === providedTitle) {
				//if the provided title matches the current item title, set the return value to current item
				returnValue = item;
				found = true;
				break;
			} else if ('subnav' in item && isRecursive) {
				iterator(item.subnav, searchTerm);

				if (found) {
					break;
				}
			}
		}
	}

	iterator(startMap.subnav, userSearchTerm);

	if (returnValue === false) {
		//shouldn't do this unless the function fails
		console.log(
			'\n"' + userSearchTerm + '" title could not be found in navMap.json'
		);
	}

	return returnValue;
}

//Throw an error if neither a string or an interval provided
function checkSearchTerm(searchTerm) {
	if (!is_string(searchTerm) && !is_numeric(searchTerm)) {
		console.log(
			'\nError: This must be either a string or an interval:\n',
			searchTerm,
			' \n'
		);
		return false;
	} else {
		return true;
	}
}

//function that accepts an array to search for specific sections of the nav map
//array accepts both numbers and titles
//function not to be used in regular code
function getSpecificMap(map, array) {
	var returnMap;
	var arrayCopy = array.splice(0);

	//if first item in array is "current" or "subnav" it makes the function a bit more efficient
	//it restricts any title searches to just offspring of the current page
	if (array[0] === 'current' || array[0] === 'subnav') {
		arrayCopy.shift();
		arrayCopy = pageMap.location.concat(link);
	}

	for (var i = 0; i < arrayCopy.length; i++) {
		var searchTerm = arrayCopy[i];
		var searchMap = typeof returnMap !== 'undefined' ? returnMap : map;

		//Output an error if neither a string or an interval provided
		if (checkSearchTerm(searchTerm)) {
			if (is_string(searchTerm)) {
				//if item is a string, do a getTitleMap function on the search term using the last map
				returnMap = getTitleMap(searchMap, searchTerm);
			} else if (is_numeric(searchTerm) && isset(searchMap.subnav)) {
				//if item is a number, return the map at the specified index of the last map in array
				returnMap = searchMap.subnav[parseInt(searchTerm)];
			} else {
				returnMap = false;
				break;
			}
		} else {
			break;
		}
	}

	if (returnMap) {
		return returnMap;
	} else {
		return false;
	}
}

//Safely converts navMap search arrays into links
//it will leave regular (string) links alone
function convertLink(pageMap, navMap) {
	var link = pageMap.link;

	//only tries to convert the link if it is an array
	var convertedLink = is_array(link) ? getNavMap(navMap, link, 'link') : link;

	// if link is an array, convert that as well recursively
	if (is_array(convertedLink)) {
		return convertLink(convertedLink);

		// only returns converted links that are strings
	} else if (is_string(convertedLink)) {
		return convertedLink;

		//errors if unable to find the link in the nav map
	} else {
		console.log(
			'\nLink conversion failed to find:\n',
			link,
			'\n in ',
			pageMap.title
		);
		return false;
	}
}

//function for looking up a specific portion of the navMap using a location array or a title
function getNavMap(navMap, searchTerm, portion) {
	let returnMap = navMap;

	if (!isset(searchTerm) || (is_array(searchTerm) && searchTerm.length === 0)) {
		//if the search term is an empty array, it will return the full nav map (excluding ROOT)
		return returnMap;
	}

	//code for when an array is given (filters results based on numbers and titles provided in array)
	if (is_array(searchTerm)) {
		returnMap = getSpecificMap(returnMap, searchTerm);

		//code for when a string is given (searches full nav map for Title that matches)
	} else if (is_string(searchTerm)) {
		returnMap = getTitleMap(returnMap, searchTerm);

		//code for when a single number is given (treats it as a single level location variable)
	} else if (is_int(searchTerm)) {
		returnMap = returnMap[searchTerm];

		//throws error if searchTerm variable doesn't make sense
	} else {
		console.log(
			'\nThe search term must be either a string, interval or an array. \nSearch term =\n',
			searchTerm
		);
	}

	if (isset(portion)) {
		return returnMap[portion];
	} else {
		return returnMap;
	}
}

function generateLink(pageMap, i, parentMap) {
	var siblings = parentMap.subnav;

	// var sibOveride;

	// // if a sibling has the 'linkGen' : 'override-siblings' setting applied, it will overide all sibling links with its own link
	// for (var sibIndex = 0; sibIndex < siblings.length; sibIndex++){
	// 	var sibling = siblings[sibIndex];
	// 	if (isset(sibling.linkGen) && sibling.linkGen == 'override-siblings'){
	// 		sibOveride = basePath+'/'+(sibIndex+1);
	// 		break;
	// 	}
	// }

	if (isset(pageMap.link)) {
		if (
			typeof pageMap.link === 'string' &&
			pageMap.link.substring(0, 4) !== 'http'
		) {
			if (pageMap.link.substring(0, 1) !== '/') {
				if (pageMap.link.indexOf(config.basePath) < 0) {
					//add base path to front of links that do not start with a back slash
					pageMap.link =
						config.basePath.length > 0
							? `/${config.basePath}/${pageMap.link}`
							: '/' + pageMap.link;
				} else {
					pageMap.link = '/' + pageMap.link;
				}
			}

			//generate file size values
			var fileExtension = pageMap.link.substr(
				pageMap.link.lastIndexOf('.') + 1
			);
			if (validFileTypes.indexOf(fileExtension) > -1) {
				var pathStart = 0;
				if (basePath.length) {
					if (pageMap.link.indexOf(basePath) === 0) {
						pathStart = basePath.length + 1;
					} else {
						pathStart = 1;
					}
				}

				var pathToFile = pageMap.link.substr(pathStart);
				var stats = fs.statSync([dirs.source, pathToFile].join('/'));
				var fileSizeInBytes = stats.size;
				pageMap.fileType = fileExtension;
				pageMap.fileSize = filesize(fileSizeInBytes);
			}
		}

		return pageMap.link; //Links to the defined link from the nav map file

		// } else if (isset(sibOveride)) {
		// 	return sibOveride;//Links to the last sibling page that has 'linkGen' set to "override-siblings"
	} else {
		// var link_generation_types = {
		// 	'normal' : pageMap.path, //Links directly to the associated page (default)
		// 	'first-child' : pageMap.path+'0/', //Links to the first page 1 level down
		// };

		// return link_generation_types[pageMap.linkGen];

		return pageMap.path;
	}
}

export { convertLink, getNavMap, generateLink };
