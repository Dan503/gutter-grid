'use strict';

export default function(gulp, plugins, args, browserSync) {

  // Watch task
  gulp.task('watch', ['browserSync'], () => {
      // Styles
      gulp.watch([
        'scss/**/*.scss',
      ], ['sass']);

      gulp.watch([
        'js/**/*.js',
        'articles/**/*.php',
        'includes/**/*.php',
        '*.php'
      ]).on('change', function () {
        browserSync.reload();
      });
  });
}
