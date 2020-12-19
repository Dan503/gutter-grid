import replaceValues from 'replace-values';

//use this file to apply your very own custom default settings to EVERY item in the nav map

// map = the current navMap item being iterated over
// index = current index in relation to sibling items
// parent = navMap item of the current items parent

//DO NOT CREATE INFITE LOOPS!
//this gets output to a json file at the end
//if you make a default value like { parent : parent } then the json file will never be able to finish compiling so it will error

//These defaults are set before any other defaults have been defined.
//Use this to overide the default generated values in the nav map
function navMap_pre_defaults(map, index, parent) {
	return {
		//link : '#'//uncomment to disable auto link generation (leaves user defined links in tact)
	};
}

//These defaults are set after the nav map has been fully generated
//Use this to have access to all the standard values usually present in the nav map
//Mostly used to define brand new default values
function navMap_post_defaults(map, index, parent) {
	replaceValues(map, {
		//propertyName : "forced overide value"
		//link : '#',//using this would disable ALL links (including links already defined in the main nav map file)
	});

	return {
		depth: map.location.length,
		index: index,
		//link : '#',//this wouldn't do anything as the "link" property has already been defined by this stage
		//parentName : parent.title,//this would set "parentName" to the current nav items parent title
	};
}

var defaultTemplate = 'standard';

export { navMap_pre_defaults, navMap_post_defaults, defaultTemplate };
