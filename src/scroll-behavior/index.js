/* eslint-disable import/no-commonjs */

module.exports = typeof window === 'undefined' ?
    require('./NextScrollBehavior.node') :
    require('./NextScrollBehavior.browser');
