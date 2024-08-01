const gulp = require('gulp')

gulp.task('animate', () => {
    return gulp
        .src('node_modules/animate.css/animate.min.css')
        .pipe(gulp.dest('src/dist/animate'))
})

gulp.task('bootstrap', () => {
    return gulp
        .src(['node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'])
        .pipe(gulp.dest('src/dist/bootstrap'))
})

gulp.task('clipboard', () => {
    return gulp
        .src('node_modules/clipboard/dist/clipboard.min.js')
        .pipe(gulp.dest('src/dist/clipboard'))
})

gulp.task('fontawesome', () => {
    return gulp
        .src(
            [
                'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
                'node_modules/@fortawesome/fontawesome-free/webfonts/**/*',
            ],
            { base: 'node_modules/@fortawesome/fontawesome-free' }
        )
        .pipe(gulp.dest('src/dist/fontawesome'))
})

gulp.task('swiper', () => {
    return gulp
        .src([
            'node_modules/swiper/swiper-bundle.min.css',
            'node_modules/swiper/swiper-bundle.min.js',
        ])
        .pipe(gulp.dest('src/dist/swiper'))
})

gulp.task('tsparticles', () => {
    return gulp
        .src(['node_modules/tsparticles/tsparticles.bundle.min.js'])
        .pipe(gulp.dest('src/dist/tsparticles'))
})

gulp.task('ua-parser-js', () => {
    return gulp
        .src('node_modules/ua-parser-js/dist/ua-parser.min.js')
        .pipe(gulp.dest('src/dist/ua-parser-js'))
})

gulp.task(
    'default',
    gulp.parallel(
        'animate',
        'bootstrap',
        'clipboard',
        'fontawesome',
        'swiper',
        'tsparticles',
        'ua-parser-js'
    )
)
