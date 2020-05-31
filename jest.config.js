'use strict';

const { compose, baseConfig, withRTL } = require('@moxy/jest-config');

module.exports = compose(
    baseConfig(),
    withRTL(),
    (config) => {
        config.setupFilesAfterEnv = [
            ...config.setupFilesAfterEnv,
            './jest.setup.js',
        ];

        return config;
    },
);
