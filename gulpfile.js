var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass');
	connect = require('gulp-connect');

var browserSync = require('browser-sync');
var reload      = browserSync.reload;


var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];
var sassSources = ['components/sass/style.scss'];
var htmlSources = ['builds/development/*.html'];
var jsonSources = ['builds/development/js/*.json'];


gulp.task('coffee', function() {
	gulp.src(coffeeSources)
		.pipe(coffee({ bare: true })
			.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulp.dest('builds/development/js'))
		.pipe(connect.reload())
		.pipe(reload({stream:true}));
});

gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			image: 'builds/development/images',
			style: 'expanded'
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest('builds/development/css'))
		.pipe(connect.reload())
		.pipe(reload({stream:true}));
});

gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch(htmlSources, ['html']);
	gulp.watch(jsonSources, ['json']);

});

gulp.task('connect', function() {
	connect.server({
		root: 'builds/development',
		livereload: true
	});
});

//BROWSER-SYNC FOR AUTOREFRESHING BROWSER // Static server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "builds/development"
        }
    });
});

//This task named html is to reload any changes made to any of the html files.
gulp.task('html', function() {
	gulp.src(htmlSources)
		.pipe(connect.reload())
		.pipe(reload({stream:true}));	
});

//This task named json is to reload any changes made to any .json files.
gulp.task('json', function() {
	gulp.src(jsonSources)
		.pipe(connect.reload())
		.pipe(reload({stream:true}));	
});

gulp.task('default', ['coffee', 'js', 'compass', 'watch', 'connect', 'browser-sync', 'html', 'json']);
