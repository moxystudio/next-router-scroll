'use strict';

const { compose, baseConfig } = require('@moxy/jest-config-base');
const withWeb = require('@moxy/jest-config-web');
const { withRTL } = require('@moxy/jest-config-testing-library');

module.exports = compose(
    baseConfig(),
    withWeb(),
    withRTL(),
    (config) => {
        config.setupFilesAfterEnv = [
            ...config.setupFilesAfterEnv,
            './jest.setup.js',
        ];

        config.moduleNameMapper = {
            'NextScrollBehavior\\.node$': '<rootDir>/src/scroll-behavior/NextScrollBehavior.browser.js',
            ...config.moduleNameMapper,
        };

        return config;
    },
);
