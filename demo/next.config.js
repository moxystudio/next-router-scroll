/* eslint-disable import/no-commonjs */
const path = require('path');

module.exports = {
    webpack: (config) => {
        config.resolve.symlinks = false;
        config.resolve.alias.react = path.join(__dirname, '../node_modules/react');
        config.resolve.alias['react-dom'] = path.join(__dirname, '../node_modules/react-dom');

        return config;
    },
};
