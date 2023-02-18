const mix = require('laravel-mix');

mix.options({
    processCssUrls: false
});

mix.js('resources/js/script.js', 'js').react();
mix.sass('resources/scss/_index.scss', 'css/main.css');