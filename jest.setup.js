/* global jest */

jest.mock('next/router', () => ({
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    components: undefined,
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
}));

