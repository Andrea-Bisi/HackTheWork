const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

//Get all JS files
mix.js('resources/js/app.js', 'public/js').version();
mix.combine([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/vue/dist/vue.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/bootstrap-table/dist/bootstrap-table.min.js',
    'node_modules/select2/dist/js/select2.min.js',
    'node_modules/highcharts/highcharts.js',
],
    'public/js/dependencies.js'
).version();

//Get all CSS files
mix.sass('resources/sass/app.scss', 'public/css');
mix.combine(
    [
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/@fortawesome/fontawesome-free/css/all.css', 
        'node_modules/select2/dist/css/select2.min.css',
        'node_modules/highcharts/css/highcharts.css',
        'public/css/app.css'
    ],
    'public/css/app_master.css'
).version();