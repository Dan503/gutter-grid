'use strict';

export default function(gulp, plugins, args, browserSync) {

  // Watch task
  gulp.task('watch', ['browserSync'], () => {
      // Styles
      gulp.watch([
        '*.scss',
        'website-src/**/*.scss'
      ], ['sass']);

      gulp.watch([
        'website-src/**/*.pug',
      ]).on('change', function () {
        browserSync.reload();
      });
  });
}
