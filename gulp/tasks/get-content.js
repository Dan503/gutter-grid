
import source from 'vinyl-source-stream';
import request from 'request';
import fs from 'fs';
import pubsub from 'pubsub-js';

import { gulp, plugins, args, config, dirs, taskTarget, browserSync } from '../config/shared-vars';

import countKeys from 'count-keys';

import read_navMap from '../helpers/read_navMap';
import { siteData } from '../helpers/generate_data';
import generate_files from '../helpers/generate_files';
//import TagSet from '../helpers/getTags';
import content_src from '../config/content_src';

//left out of git on purpose for security reasons
//import authentification from '../config/authentification';

// generates all the pages that are in the site using the navMap
export default function() {

	gulp.task('get-content', /*['copy:dynamic-assets'],*/ () => {

		let content = {};
		let readyCounter = 0;

		const
			noContentGathering = content_src() === false,
			idTotal = countKeys(siteData.navMap.subnav, {filter: property => property === 'id'}) - 1,
			ignoringContent = noContentGathering || !args.content && !args.production,
			dest = `./${dirs.temporary}`,
			fileName = 'content.json';

		//fs.readFile('./src/_1_modules/glossaryTerm/glossaryTerm-markup.pug', 'utf8', (pugErr, pugMarkup) => {

		if (ignoringContent) {
			let message;
			if (noContentGathering){
				message = 'Feature not available yet';
				//message = 'No content to gather. Define a content source in /gulp/config/content_src.js'
			} else {
				message = 'use the "--content" or "--production" flags to generate site content'
			}
			console.log(`\nIgnoring content: ${message}\n`);
			generate_files({dest, fileName, content: {}});

		} else {

			//third read of the nav map
			siteData.navMap.subnav.forEach((map, index) => {
				read_navMap(map, index, (pageMap, i, parentMap) => {

					let id = pageMap.id;

					if (id){

						request.get({
							url: content_src(id),
							//url: `http://www.danieltdesign.com/${id}.json`,
							json: true,
							auth: authentification,
						}, (err, res, data) => {
							if (res.statusCode === 200) {
								// you can use data here - already parsed as json

								//removes div tags and empty paragraphs from output
								let removals = /<div>|<\/div>|<p>&nbsp;<\/p>/ig;

								if (typeof id !== 'undefined'){
									pubsub.subscribe('allTagsReady-'+id, updateContent)

									if (args.debug) console.log(pageMap.title + ' [data loaded]');

									let contentString = data.body.storage.value;
									contentString = contentString.replace(removals, '');

									if (pugErr) return console.log(pugErr);
									///STARTS THE CHAIN REACTION
									const tagSet = new TagSet(contentString, pugMarkup, false, id);
									if (tagSet.tags.length === 0) updateContent([]);
								}

								function updateContent(tags){

									if (args.debug) console.log(pageMap.title + ' [tags ready]');

									readyCounter++;

									if (id){
										content[id] = {
											title : pageMap.cmsTitle || data.title,
											content : tags
										}
									}

									console.log(` ${(readyCounter / idTotal * 100).toFixed(0)}% - ${readyCounter}/${idTotal} pages ready`);

									if (readyCounter === idTotal){
										generate_files({dest, fileName, content});
									}
								}

							} else if (err) {
								// handle error
								console.log(`Unable to retrieve content for page ${pageMap.title}:\n`, err);
							} else {
								// response other than 200 OK
							}
						});

					}

				});

			});
		}

		//});

	});

}
