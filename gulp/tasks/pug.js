/* eslint-disable indent */
'use strict';

import {
	gulp,
	plugins,
	args,
	config,
	basePath,
	dirs,
	taskTarget,
	browserSync,
	pjson,
	notification_icon_location,
	reload,
} from '../config/shared-vars';

import fs from 'fs';
import path from 'path';
import foldero from 'foldero';
import dir from 'node-dir';
import pug from 'pug';
import yaml from 'js-yaml';
import source from 'vinyl-source-stream';
import notifier from 'node-notifier';
import del from 'del';
import { applyDefaults, defaultTo } from 'default-to';
import replaceValues from 'replace-values';

import waitForFile from '../helpers/waitForFile';
import {
	is_string,
	is_int,
	is_numeric,
	is_array,
	in_array,
	isset,
	end,
} from '../helpers/php-to-js-translators';
import {
	convertLink,
	getNavMap,
	generateLink,
} from '../helpers/navMap-helpers';
import { generate_data, siteData } from '../helpers/generate_data';
import read_navMap from '../helpers/read_navMap';
import generateFolderName from '../helpers/generateFolderName';
import generateFiles from '../helpers/generate_files';

import {
	navMap_pre_defaults,
	navMap_post_defaults,
	defaultTemplate,
} from '../config/navMap-user-defaults';
import page_pug_file from '../config/generator_templates/page_pug_file';
import redirect_page from '../config/generator_templates/redirect_page';

let pugPostTasks = ['clean:pages:empty'];

export default function () {
	let dirs = config.directories;
	let dest = path.join(taskTarget, config.basePath);
	let navMapDest = dirs.temporary;
	let freshCompile = false;

	const generate_html_pages = (done) => {
		freshCompile = true;

		console.log(plugins.util.colors.bold('\nGenerated these pages:'));

		let siteData = generate_data();

		var homeFolder = generateFolderName(0, siteData.navMap.subnav[0].title);

		var templates_not_in_nav = [];

		//function for automatically generating pages based on their location in the nav map
		function generate_page(map, index, parent, hasExclusive, templateList) {
			function run_page_generation() {
				//Determines what the file name should be
				var stream = source('index.pug');

				fs.stat(map.pageLocation + '_content.pug', function (err, stat) {
					let contentExists = err == null;
					let pageFileSource = page_pug_file(map, index, parent, contentExists);

					//generates the page content
					stream.end(pageFileSource);
					//generates the page file
					stream.pipe(gulp.dest(map.pageLocation));

					//Tells you what pages have been generated and where to find them
					console.log(`
 - ${plugins.util.colors.yellow(
		map.title
 )} | ${plugins.util.colors.green(map.template)} | [${map.location}]
   ${map.path}`);
				});
			}

			//if generate set to false, it does not get generated
			//if generateKids set to false, direct child pages do not get generated
			//if generate is set to true, it overides the generateKids setting
			//defaults to true
			if (typeof map.generate === 'undefined') {
				if (parent.generateKids === false) {
					map.generate = false;
				} else {
					map.generate = true;
				}
			}
			if (typeof map.generateKids === 'undefined') {
				map.generateKids = true;
			}

			//if generate is set to "exclusive", exclusive pages will be the only pages that are generated
			//This is to rapidly speed up development when only working on one page of a prototype
			//Remove the "generate:exclusive" setting from the nav map item when you have finished working on it
			//Always generates the home page since the index file is dependent on it
			var exclusivityTest =
				(hasExclusive && map.generate === 'exclusive') ||
				(map.location.length === 1 && map.location[0] === 0);
			var page_is_allowed =
				(map.inTemplateList && !map.templateListItem) ||
				(map.templateListItem &&
					templates_not_in_nav.indexOf(map.template) > -1) ||
				args.production ||
				args.all;

			if (hasExclusive) {
				if (exclusivityTest) {
					run_page_generation();
				}
			} else if (map.generate && page_is_allowed) {
				run_page_generation();
			}
		}

		let hasExclusive = false;
		let templateHits = [];
		let templateMapList = {};
		let templateNavItem = {
			title: 'Templates',
			generate: false,
			link: '#',
			subnav: [],
		};

		//Grabs a list of all the template files in the _templates directory
		let templateFiles = [];
		var templatesFolder = path.join(dirs.source, dirs.templates);

		dir.files(templatesFolder, function (err, files) {
			if (err) throw err;
			templateFiles = files.sort().filter(function (file) {
				return file.indexOf('.pug') > -1;
			});
			templateFiles.forEach((file, i) => {
				templateFiles[i] = file
					.substr(templatesFolder.length + 1)
					.replace('.pug', '');
			});

			//need to place the rest of the code here to ensure template list has been generated before continuing on

			templateFiles.forEach((file, i) => {
				let filePath =
					[
						basePath,
						dirs.pages,
						homeFolder,
						generateFolderName(i, templateNavItem.title),
						generateFolderName(i, file),
					].join('/') + '/';
				templateMapList[file] = {
					title: file.replace(/-+/g, ' '),
					template: file,
					link: filePath,
					path: filePath,
					inTemplateList: true,
					templateListItem: true,
				};
			});

			// first read of the nav map
			siteData.navMap.subnav.forEach((map, index) => {
				read_navMap(map, index, (pageMap, i, parentMap) => {
					pageMap.inTemplateList = defaultTo(pageMap.inTemplateList, false);

					//applies default system values
					applyDefaults(pageMap, {
						//This means that the items subnav will appear in the navigation (this needs to be coded in though, it isn't pre-packaged)
						//works with the hasSubNav pug function
						subNavigable: true,

						//when set to "overide-siblings" in the nav map, all the siblings of that page will link to the overide page instead of their own page (can be good for listing pages)
						//This doesn't actually work at the moment
						//linkGen : 'normal',
					});

					//looks for exclusivity settings
					//if "--production" or "--all" flag used, ignores generate:exclusive settings in the nav map
					if (
						pageMap.generate === 'exclusive' &&
						!args.production &&
						!args.all
					) {
						hasExclusive = true;
					}

					//collects all the templates
					var not_in_template_list_already =
							templateHits.indexOf(pageMap.template) < 0,
						not_under_home_page_as_default_template = !(
							pageMap.location[0] === 0 && pageMap.template === defaultTemplate
						),
						not_a_link_to_another_page =
							pageMap.link !== 'undefined'
								? !is_array(
										pageMap.link
								  ) /*&& pageMap.link.substr(0, 4) !== 'http'*/
								: true,
						not_an_external_link =
							typeof pageMap.link !== 'undefined'
								? !/^http/.test(pageMap.link)
								: true,
						template_is_allowed =
							not_in_template_list_already &&
							not_under_home_page_as_default_template &&
							not_a_link_to_another_page &&
							not_an_external_link;

					//changes template list link to an existing page by using the current page
					if (template_is_allowed) {
						templateHits.push(pageMap.template);

						pageMap.inTemplateList = true;

						var templateMap = templateMapList[pageMap.template];

						if (isset(templateMap)) {
							//using location so that it uses the actual link value of the location rather than the default generated value
							let link = pageMap.location;

							if (typeof pageMap.link === 'string') {
								link = pageMap.link;
							}

							templateMap = replaceValues(templateMap, {
								link: link,
								generate: false,
							});
						} else {
							console.log(
								`${plugins.util.colors.bold.red('WARNING!')} The "${
									pageMap.template
								}" template is defined in the nav map but the file was not found.`
							);
						}
					}

					//generate default links
					pageMap.link = generateLink(pageMap, index, parentMap);
				});
			});

			//adds template list nav items
			templateFiles.forEach((thisTemplate) => {
				templateNavItem.subnav.push(templateMapList[thisTemplate]);
			});

			//Adds the template nav item to the main nav map
			const homeSubnav = defaultTo(siteData.navMap.subnav[0].subnav, []);
			homeSubnav.push(templateNavItem);
			siteData.navMap.subnav[0].subnav = homeSubnav;

			//waits for the content.json file to be created before going any further
			// waitForFile(path.join(navMapDest, 'content.json'), ()=> {

			//2nd read of the nav map
			siteData.navMap.subnav.forEach((map, index) => {
				read_navMap(map, index, (pageMap, i, parentMap) => {
					if (templateHits.indexOf(pageMap.template) < 0) {
						templates_not_in_nav.push(pageMap.template);
					}

					//generates the pages
					generate_page(pageMap, i, parentMap, hasExclusive);

					//convert reference array links into real links
					pageMap.link = convertLink(pageMap, siteData.navMap);

					let finalDefaults = navMap_post_defaults(pageMap, i, parentMap);
					applyDefaults(pageMap, finalDefaults);
				});
			});

			//Determines what the file name should be
			var JSON_filename = 'fullNavMap.json';
			var outputJSON = source(JSON_filename);

			//generates the page content
			outputJSON.end(JSON.stringify(siteData.navMap));
			//generates the page file
			outputJSON.pipe(plugins.jsonFormat(2)).pipe(gulp.dest(navMapDest));

			//waits for index.pug to exist before trying to compile
			waitForFile(
				path.join(dirs.source, dirs.pages, homeFolder, 'index.pug'),
				{ notify: false },
				() => {
					//Tells you what pages have been generated and where to find them
					console.log(`
   ${plugins.util.colors.bold(
			'The full generated navMap for debugging can be found here:'
		)}
   ${navMapDest}/${plugins.util.colors.yellow(JSON_filename)}\n`);

					if (templates_not_in_nav.length > 0) {
						console.log(`
   ${plugins.util.colors.red('WARNING:')}
   The following templates have not been assigned a page in the navMap:
   ${plugins.util.colors.green('"' + templates_not_in_nav.join('", "') + '"')}
`);
					}

					if (hasExclusive || (!args.production && !args.all)) {
						var options = [
							`
   - Use the ${plugins.util.colors.yellow('--all')} flag when running tasks
     ${plugins.util.colors.grey('(This is for one off full site compiles)')}`,
							`
   - Use the ${plugins.util.colors.yellow(
			'--production'
		)} flag when running tasks
     ${plugins.util.colors.grey(
				'(This is to prevent accidental partial compiles during code releases)'
			)}`,
						];

						if (hasExclusive) {
							options.push(`
   - Remove all ${plugins.util.colors.yellow(
			'"generate":"exclusive"'
		)} commands from navMap.json
     ${plugins.util.colors.grey(
				[
					'(This is for permenant changes, you can always add them back later)',
					'(This will revert back to the default functionality of only',
					'generating 1 page per template)',
				].join('\n     ')
			)}`);
						}

						console.log(`
  ${plugins.util.colors.yellow.bold('Not compiling the full site?')}

   If you wish to generate the full site, you have ${options.length} options:`);

						options.forEach((option) => {
							console.log(option);
						});

						console.log(`

   ${plugins.util.colors.red('WARNING:')}
   Compiling the full site takes significantly longer than
   compiling individual pages.

   The recommended approach to working is to assign
   ${plugins.util.colors.yellow(
			'"generate":"exclusive"'
		)} to the pages that you are currently
   working on in the navMap then use the ${plugins.util.colors.yellow(
			'--all'
		)} flag when
   you want to do a full site compile.

   For the best balance between compile speed/vs navigability
   of the site, by default, only one copy of each template
   is generated.
`);
					}

					done();
				}
			);
			// });
		});
	};

	const compile_pug = (done) => {
		//ensures you are working with the latest data
		const siteData = generate_data();

		// Add --debug option to your gulp task to view
		// what data is being loaded into your templates
		if (args.debug) {
			console.log('==== DEBUG: site.data being injected to templates ====');
			console.log(siteData);
			console.log(
				'\n==== DEBUG: package.json config being injected to templates ===='
			);
			console.log(config);
		}

		var haveNotified = false;

		const pugFilters = [require('marked')];

		var a = 0;
		var b = 0;

		return gulp
			.src([
				path.join(dirs.source, '**/*.pug'),
				'!' + path.join(dirs.source, '{**/_*,**/_*/**}'),
			])
			.pipe(plugins.changed(dest))
			.pipe(
				plugins.plumber((error) => {
					if (a === 0) {
						console.log(
							`\n ${plugins.util.colors.red.bold(
								'Pug failed to compile:'
							)} ${plugins.util.colors.yellow(error.message)}\n`
						);

						console.log(error.stack);

						a++;
						return notifier.notify({
							title: 'Pug Error',
							message: error.message,
							icon: notification_icon_location + 'gulp-error.png',
						});
					}
				})
			)
			.pipe(
				plugins.pug({
					pug: pug,
					filters: pugFilters,
					pretty: true,
					basedir: './' + [dirs.source].join('/'),
					locals: {
						args,
						require,
						config,
						pugFilters,
						compile: pug.compile,
						pkg: pjson,
						debug: true,
						site: {
							data: siteData,
						},
					},
				})
			)
			.pipe(
				plugins.htmlmin({
					collapseBooleanAttributes: true,
					conservativeCollapse: true,
					removeCommentsFromCDATA: true,
					removeEmptyAttributes: true,
					removeRedundantAttributes: true,
				})
			)
			.pipe(gulp.dest(dest))
			.on('end', () => {
				notifier.notify({
					title: 'Pug',
					message: 'HTML compiled successfully',
					icon: notification_icon_location + 'gulp.png',
				});

				if (config.serve === 'php') pugPostTasks.push('convert-HTML');

				done();

				// gulp.series(pugPostTasks)(done);
				setTimeout(browserSync.reload, 500);
			});
	};

	const read_nav_map = (done) => {
		dir.readFiles(
			navMapDest,
			{
				match: /[fullNavMap|content]\.json$/,
				recursive: false,
			},
			function (err, content, next) {
				if (err) throw err;

				let data = JSON.parse(content);

				if (typeof data.subnav !== 'undefined') {
					//Need to read the generated nav map if we want to compile without regenerating all the pages again
					siteData.navMap = JSON.parse(content);
				} else {
					//adds the site content to the site data
					siteData.content = JSON.parse(content);
				}
				next();
			},
			function (err, files) {
				//finished reading files
				if (err) throw err;
				//console.log('finished reading files:', files);

				done();

				//compiles the site after reading the content.json file and the navmap.json file
				// compile();
			}
		);
	};

	// pug template compile
	gulp.task(
		'pug:compile',
		gulp.series(read_nav_map, compile_pug, pugPostTasks, reload)
	);

	// generates all the pages that are in the site using the navMap
	gulp.task(
		'pug:generate-pages',
		gulp.series(generate_html_pages, 'pug:compile')
	);

	//converts all the html files to pug files
	gulp.task('convert-HTML', () => {
		var src = [taskTarget, '**/*.html'].join('/');
		return gulp
			.src(src)
			.pipe(
				plugins.rename(function (path) {
					path.extname = '.php';
				})
			)
			.pipe(gulp.dest(taskTarget))
			.on('end', function () {
				del.sync(src);
			});
	});

	//generates a redirect page if there is a need for one
	gulp.task('generate-redirect', () => {
		if (
			config.basePath &&
			config.basePath !== '' &&
			config.basePath !== '/' &&
			config.redirect === true
		) {
			return generateFiles(
				{
					dest: `./${taskTarget}`,
					fileName: 'index.' + config.serve.toLowerCase(),
					content: redirect_page,
				},
				'Generated this redirect page:'
			);
		} else {
			return Promise.resolve();
		}
	});

	gulp.task(
		'pug',
		gulp.series(
			gulp.parallel(
				'symbolize-svgs',
				'clean:pages:indexes',
				'generate-redirect'
			),
			'pug:generate-pages'
		)
	);
}
