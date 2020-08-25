/* global jest */

jest.mock('next/router', () => {
    const listenersMap = {};

    return {
        pathname: '/',
        route: '/',
        query: {},
        asPath: '/',
        components: undefined,
        events: {
            on: jest.fn((name, fn) => {
                listenersMap[name] = listenersMap[name] ?? new Set();
                listenersMap[name].add(fn);
            }),
            off: jest.fn((name, fn) => {
                listenersMap[name]?.delete(fn);
            }),
            emit: jest.fn((name, ...args) => {
                listenersMap[name]?.forEach((fn) => fn(...args));
            }),
        },
        push: jest.fn(),
        replace: jest.fn(),
        reload: jest.fn(),
        back: jest.fn(),
        prefetch: jest.fn(),
        beforePopState: jest.fn(),
    };
});
