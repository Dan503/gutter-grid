'use strict';

import {
	gulp,
	plugins,
	args,
	config,
	dirs,
	taskTarget,
	browserSync,
	notification_icon_location,
	bp,
} from '../config/shared-vars';

import path from 'path';
import autoprefixer from 'autoprefixer';
import gulpLoadPlugins from 'gulp-load-plugins';
import notifier from 'node-notifier';

import exportAsset from '../helpers/exportAsset';

const postcss = gulpLoadPlugins({
	pattern: ['postcss-*', 'postcss.*'],
	replaceString: /^postcss(-|\.)/,
});

let entries = config.entries;
let dest = path.join(
	taskTarget,
	config.basePath,
	dirs.assets,
	dirs.styles.replace(/^_0_/, '')
);

let px2rem_settings = {
	rootValue: 10,
	propWhiteList: ['font', 'font-size', 'letter-spacing'],
	replace: false,
};

let sass_settings = {
	outputStyle: 'expanded',
	precision: 5,
	includePaths: [
		path.join(dirs.source, dirs.styles),
		path.join(dirs.source, dirs.modules),
	],
};

const compile_CSS = () => {
	let a = 0;
	let b = 0;

	//Primary css file compilation
	return gulp
		.src([path.join(dirs.source, dirs.styles, entries.css)])
		.pipe(
			plugins.plumber((error) => {
				if (a === 0) {
					console.log(
						`\n ${plugins.util.colors.red.bold(
							'Sass failed to compile:'
						)} ${plugins.util.colors.yellow(error.message)}\n`
					);

					console.log(error.stack);

					a++;
					return notifier.notify({
						title: 'Sass Error',
						message: error.message,
						icon: notification_icon_location + 'gulp-error.png',
					});
				}
			})
		)
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.sassGlob())
		.pipe(plugins.sass(sass_settings).on('error', plugins.sass.logError))
		.pipe(
			plugins.postcss([
				autoprefixer({
					browsers: [
						'last 2 version',
						'> 5%',
						'safari 5',
						'ios 6',
						'android 4',
					],
				}),
				//postcss.flexibility(),
				postcss.pxtorem(px2rem_settings),
			])
		)
		.pipe(
			plugins.rename(function (path) {
				// Remove 'source' directory as well as prefixed folder underscores
				// Ex: 'src/_styles' --> '/styles'
				path.dirname = path.dirname.replace(dirs.source, '').replace('_', '');
			})
		)
		.pipe(plugins.if(args.production, plugins.cssnano({ rebase: false })))
		.pipe(plugins.sourcemaps.write('./'))
		.pipe(
			plugins.if(() => {
				return b++ === 0;
			}, plugins.notify({ title: 'Sass', message: 'CSS compiled successfully' }))
		)
		.pipe(gulp.dest(dest))
		.pipe(browserSync.stream({ match: '**/*.css' }));
};

const compile_stripped_out_MQs_CSS = () => {
	//stripped out MQs version
	return gulp
		.src([path.join(dirs.source, dirs.styles, 'main.legacy.scss')])
		.pipe(plugins.plumber())
		.pipe(plugins.sassGlob())
		.pipe(plugins.sass(sass_settings).on('error', plugins.sass.logError))
		.pipe(
			plugins.postcss([
				autoprefixer({
					browsers: [
						'last 2 version',
						'> 5%',
						'safari 5',
						'ios 6',
						'android 4',
					],
				}),
				postcss.pxtorem(px2rem_settings),
				//postcss.flexibility(),
				postcss.unmq({ width: bp.page + 10 }),
			])
		)
		.pipe(
			plugins.rename(function (path) {
				// Remove 'source' directory as well as prefixed folder underscores
				// Ex: 'src/_styles' --> '/styles'
				path.basename = 'noMQs-' + path.basename;
			})
		)
		.pipe(plugins.if(args.production, plugins.cssnano({ rebase: false })))
		.pipe(gulp.dest(dest));
};

const export_CSS = () => {
	exportAsset({ file: entries.css, path: dirs.styles, icons: true });
	exportAsset({
		file: 'noMQs-' + entries.css,
		path: dirs.styles,
		icons: false,
		notify: false,
	});
};

//pure sass compilation
//does not copy across new icons
gulp.task(
	'sass:compile',
	gulp.series(
		gulp.parallel(compile_CSS, compile_stripped_out_MQs_CSS),
		export_CSS
	)
);

//full sass compile including icon copying
gulp.task('sass', gulp.series('icomoon-unpackager', 'sass:compile'));
