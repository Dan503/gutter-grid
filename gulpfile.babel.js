'use strict';

import wrench from 'wrench';
import { gulp, plugins, args, config, dirs, basePath, allSites, site, taskTarget, browserSync, jsWatch } from './gulp/config/shared-vars';

import waitForFile from './gulp/helpers/waitForFile';

// This will grab all js in the `tmp/gulp-local-clone` directory
// in order to load all gulp tasks
wrench.readdirSyncRecursive('./'+dirs.gulp+'/tasks').filter((file) => {
  return (/\.(js)$/i).test(file);
}).map(function(file) {
  require('./'+dirs.gulp+'/tasks/'+file)();
});

var clean = args.production ? ['clean', 'clean:livesite'] : ['clean'];

// Compiles all the code
gulp.task('compile', [
  'copy',
  'pug',
  'scripts',
  'imagemin',
  'symbolize-svgs',
  'sass',
  'modernizr',
]);

let user_used_serve = false;

gulp.task('serve', ()=>{
  user_used_serve = true;
  gulp.start('default');
});

// Testing
gulp.task('test', ['eslint']);

// Default task (cleans and builds then runs server then watches for changes)
gulp.task('default', clean, () => {

 	jsWatch.isEnabled = true;

  gulp.start(['clean:pages:empty','compile']);

  //once home page file has been generated, start watch and browsersync
  //(pug tends to be the task that takes the longest amount of time to compile)
  waitForFile([taskTarget, basePath, 'index.'+config.serve].join('/'), ()=>{
    //includes browsersync
    gulp.start('watch');

    if (user_used_serve){
      // User friendly message for Yeogurt users who are used to running "gulp serve"
      setTimeout(()=>{
        console.log(`\n   Just use "${plugins.util.colors.bold.green('gulp')}" rather than "${plugins.util.colors.bold.red('gulp serve')}" \n`)
      }, 2000);
    }
  });
});


//Cleans and builds only with no server
gulp.task('build', clean, () => {
  gulp.start('compile');
});
