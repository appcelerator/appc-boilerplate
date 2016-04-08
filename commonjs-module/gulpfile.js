'use strict';

const $ = require('gulp-load-plugins')();
const del = require('del');
const gulp = require('gulp');
const manifest = require('./package.json');
const path = require('path');

const coverageDir = path.join(__dirname, 'coverage');
const distDir = path.join(__dirname, 'dist');
const docsDir = path.join(__dirname, 'documentation');
const stagingDir = path.join(__dirname, 'staging');

/*
 * Clean tasks
 */
gulp.task('clean', ['clean-coverage', 'clean-dist', 'clean-docs', 'clean-staging', 'clean-zip']);

gulp.task('clean-coverage', done => { del([coverageDir]).then(() => done()) });

gulp.task('clean-dist', done => { del([distDir]).then(() => done()) });

gulp.task('clean-docs', done => { del([docsDir]).then(() => done()) });

gulp.task('clean-staging', done => { del([stagingDir]).then(() => done()) });

gulp.task('clean-zip', done => { del(['*.zip']).then(() => done()) });

/*
 * build tasks
 */
gulp.task('build', ['clean-dist', 'lint-src'], () => {
	return gulp
		.src('src/index.js')
		.pipe($.plumber())
		.pipe($.debug({ title: 'build' }))
		.pipe($.sourcemaps.init())
		.pipe($.rollup({
			sourceMap: true
		}))
		.pipe($.babel())
		.pipe($.rename(manifest.name + '.js'))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(distDir));
});

gulp.task('prep', ['build', 'docs'], () => {
	// TODO Include documentation!
	return gulp.src(['dist/' + manifest.name + '.js', 'package.json', 'manifest', 'LICENSE'])
		.pipe(gulp.dest(path.join(__dirname, 'staging', 'modules', 'commonjs', manifest.name, manifest.version)));
});

gulp.task('dist', ['prep'], () => {
	return gulp.src('staging/**/*')
		.pipe($.zip(manifest.name + '-commonjs-' + manifest.version + '.zip'))
		.pipe(gulp.dest(__dirname));
});

gulp.task('docs', ['lint-src', 'clean-docs'], () => {
	return gulp.src('src')
		.pipe($.plumber())
		.pipe($.debug({ title: 'docs' }))
		.pipe($.esdoc({
			// debug: true,
			destination: docsDir,
			plugins: [
				{ name: 'esdoc-es7-plugin' }
			],
			title: manifest.name
		}));
});

/*
 * lint tasks
 */
function lint(pattern) {
	return gulp.src(pattern)
		.pipe($.plumber())
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.eslint.failAfterError());
}

gulp.task('lint-src', () => lint('src/**/*.js'));

gulp.task('lint-test', () => lint('test/**/test-*.js'));

/*
 * test tasks
 */
gulp.task('test', ['lint-src', 'lint-test'], () => {
	let suite;
	let grep;
	let p = process.argv.indexOf('--suite');
	if (p !== -1 && p + 1 < process.argv.length) {
		suite = process.argv[p + 1];
	}
	p = process.argv.indexOf('--grep');
	if (p !== -1 && p + 1 < process.argv.length) {
		grep = process.argv[p + 1];
	}

	return gulp.src(['src/**/*.js', 'test/**/*.js'])
		.pipe($.plumber())
		.pipe($.debug({ title: 'build' }))
		.pipe($.babel())
		.pipe($.injectModules())
		.pipe($.filter(suite ? ['test/setup.js'].concat(suite.split(',').map(s => 'test/**/test-' + s + '.js')) : 'test/**/*.js'))
		.pipe($.debug({ title: 'test' }))
		.pipe($.mocha({ grep: grep }));
});

gulp.task('coverage', ['lint-src', 'lint-test', 'clean-coverage'], cb => {
	gulp.src('src/**/*.js')
		.pipe($.plumber())
		.pipe($.debug({ title: 'build' }))
		.pipe($.babelIstanbul())
		.pipe($.injectModules())
		.on('finish', () => {
			gulp.src('test/**/*.js')
				.pipe($.plumber())
				.pipe($.debug({ title: 'test' }))
				.pipe($.babel())
				.pipe($.injectModules())
				.pipe($.mocha())
				.pipe($.babelIstanbul.writeReports())
				.on('end', cb);
		});
});

gulp.task('default', ['build']);
