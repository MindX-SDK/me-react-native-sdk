const url = require('@rollup/plugin-url');
const copy = require('rollup-plugin-copy');

module.exports = {
  rollup(config) {
    config.plugins = [
        ...config.plugins,
        url({
            // // Where to put files
            // destDir: 'dist/assets/',
            // // Path to put infront of files (in code)
            // publicPath: 'src/',
            // // File name once copied
            // fileName: '[name][extname]',
            // Kinds of files to process
            include: [
                '**/*.svg',
                '**/*.png',
                '**/*.gif',
                '**/*.jpg',
                '**/*.jpeg',
                '**/*.js',
            ]
        }),
        copy({
            targets: [
              { src: 'src/shim.js', dest: 'dist/' },
            ]
        })
    ];

    return config;
  },
};