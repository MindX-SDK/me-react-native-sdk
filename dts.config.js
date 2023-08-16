const url = require('@rollup/plugin-url');

module.exports = {
  rollup(config) {
    config.plugins = [
        ...config.plugins,
        url({
            // Where to put files
            destDir: 'dist/assets/',
            // Path to put infront of files (in code)
            publicPath: 'src/',
            // File name once copied
            fileName: '[name][extname]',
            // Kinds of files to process
            include: [
                '**/*.svg',
                '**/*.png',
                '**/*.gif',
                '**/*.jpg',
                '**/*.jpeg',
            ]
        }),
    ];

    return config;
  },
};