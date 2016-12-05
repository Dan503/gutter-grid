'use strict';

import autoprefixer from 'autoprefixer';
import gulpif from 'gulp-if';

export default function(gulp, plugins, args, browserSync) {
  // Sass compilation
  gulp.task('sass', () => {
    gulp.src('website-src/custom-styles.scss')
      .pipe(plugins.plumber())
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass({
        outputStyle: 'expanded',
        precision: 10,
        includePaths: [
        	'scss'
        ]
      }).on('error', plugins.sass.logError))
      .pipe(plugins.postcss([autoprefixer({browsers: ['last 2 version', '> 5%', 'safari 5', 'ios 6', 'android 4']})]))
      .pipe(gulpif(args.production, plugins.cssnano({rebase: false})))
      .pipe(plugins.sourcemaps.write('./'))
      .pipe(gulp.dest('./website/stylesheets'))
      .pipe(browserSync.stream({match: '**/*.css'}));
  });
}
