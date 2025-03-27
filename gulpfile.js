'use strict';

const build = require('@microsoft/sp-build-web');
//Aggiunto per usare JSDoc
const gulp = require('gulp');
const jsdoc = require('gulp-jsdoc3');
//fine aggiunta

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.initialize(require('gulp'));

//Aggiunto per usare JSDoc
gulp.task('jsdoc', function (cb) {
  const config = require('./jsdoc.conf.json'); // Percorso del tuo file di configurazione JSDoc
  gulp.src(['src/**/*.ts', 'src/**/*.tsx', 'README.md'], { read: false })
      .pipe(jsdoc(config, cb));
});
//fine aggiunta