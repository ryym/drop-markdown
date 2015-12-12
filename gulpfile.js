const path         = require('path');
const gulp         = require('gulp');
const babelify     = require('babelify');
const browserify   = require('browserify');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concatCss    = require('gulp-concat-css');
const source       = require('vinyl-source-stream');
const webserver    = require('gulp-webserver');

function toPath() {
  const args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(null, [__dirname].concat(args));
}

const PATHS = {
  src:   toPath('src'),
  js:    toPath('src', 'js'),
  css:   toPath('src', 'css'),
  build: toPath('build')
};

/**
 * Display defined paths.
 */
gulp.task('paths', () => {
  Object.keys(PATHS).forEach(name => {
    console.log(`${name}: ${PATHS[name]}`);
  });
});

/**
 * Push to gh-pages.
 */
gulp.task('deploy', ['build'], () => {
  const ghpages = require('gh-pages');
  ghpages.publish(PATHS.build, {
    logger: console.log.bind(console)
  });
});

/**
 * Transpile and bundle JavaScripts.
 */
gulp.task('browserify', () => {
  return browserify(PATHS.js, { debug: true })
    .transform(babelify, { presets: ['es2015'] })
    .bundle()
    .on('error', err => console.error(err))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(PATHS.build));
});

/**
 * Compile and concat css files.
 */
gulp.task('css', () => {
  const csses = path.join(PATHS.css, '**/*.scss');
  return gulp
    .src(csses)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(concatCss('main.css', {
      includePaths: ['node_modules']
    }))
    .pipe(gulp.dest(PATHS.build));
});

/**
 * Build JavaScript and CSS.
 */
gulp.task('build', ['browserify', 'css']);

/**
 * Watch changes and rebuild.
 */
gulp.task('watch', () => {
  const jses  = path.join(PATHS.js, '**/*.js');
  const csses = path.join(PATHS.css, '**/*.scss');
  gulp.watch(jses, ['browserify']);
  gulp.watch(csses, ['css']);
});

/**
 * Publish files in the build directory.
 */
gulp.task('webserver', () => {
  gulp
    .src(PATHS.build)
    .pipe(webserver({
      host: 'localhost',
      livereload: true
    }));
});

/** Default tasks */
gulp.task('default', ['build', 'watch', 'webserver']);
