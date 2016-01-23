var gulp = require("gulp"),
    livereload = require('gulp-livereload'),
    rename = require('concur-gulp-rename'),
    webpack = require('webpack-stream'),
    fs = require('fs'),
    path = require('path'),
    gzip = require('gulp-gzip');

process.env.NODE_ENV = process.env.NODE_ENV || "development";

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

gulp.task('webpack', function() {
    return gulp.src("webpack.config.js")
        .pipe(webpack(require('./webpack.config.js'), require('webpack')))
        .pipe(gulp.dest('public'));
});

gulp.task('copy', function() {
    return gulp.src("./vendors/dashboard/**/*")
        .pipe(gulp.dest('public'));
});

gulp.task('build', ['copy', 'webpack']);
gulp.task('clean', function(cb) {
    require('del')(['./public'], cb);
});
gulp.task('cleangz', function(cb) {
    require('del')(['./public/**/*.gz'], cb);
})
gulp.task('default', ['build']);
gulp.task('buildgz', ['build'], function() {
    return gulp.src('public/**/!(*.gz|*.png|*.jpg|*.jpeg|*.svg)') // png and jpg already very well compressed, might even make it larger
        .pipe(require('gulp-size')({
            showFiles: true
        }))
        .pipe(gzip({
            gzipOptions: {
                level: 9
            }
        }))
        .pipe(rename({
            extname: ".gz"
        }))
        .pipe(require('gulp-size')({
            showFiles: true
        }))
        .pipe(gulp.dest('public'));
});
gulp.task('deploy', ['build', 'buildgz'], function() {
    var readYaml = require('read-yaml');
    var config = readYaml.sync('./config/deploy.yml')[process.env.NODE_ENV];
    if (!config) {
        throw "./config/deploy.yml#" + process.env.NODE_ENV + " is required";
    }
    // this requires a config to be written somewhere
    // clean seems to be clashing with everything, run it seperately
    var options = {
        headers: {
            'Cache-Control': 'max-age=315360000, no-transform, public'
        }
    };
    return gulp.src('./public/**/*')
        .pipe(rename(function(path) {
            path.dirname = "public/" + path.dirname;
            console.log(path);
        }))
        .pipe(require('gulp-s3')(config, options));
});
gulp.task('httpServer', function() {
    process.env.RUNNING = "local";
    var App = require('./index.js');
    var HTTPServer = new App();
    HTTPServer.start(function() {
        console.log('info', 'server listening');
    });
});
gulp.task('server', ['httpServer', 'build'],function(){
    gulp.src("./public/**/*").pipe(livereload());
    livereload.listen();
    return gulp.watch(['app/assets/**', 'app/view/**', 'vendors/dashboard/css/**', 'vendors/dashboard/js/**', 'vendors/dashboard/images/**'], ["build"]);
});