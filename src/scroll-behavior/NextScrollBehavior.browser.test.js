import { pick } from 'lodash';
import Router from 'next/router';
import NextScrollBehavior from './NextScrollBehavior.browser';

const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

let mockStateStorage;
let scrollBehavior;

window.scrollTo = jest.fn();

jest.spyOn(window, 'addEventListener');
jest.spyOn(window, 'removeEventListener');
jest.spyOn(Router.events, 'on');
jest.spyOn(Router.events, 'off');

jest.mock('./StateStorage', () => {
    const StateStorage = jest.requireActual('./StateStorage');

    class SpiedStateStorage extends StateStorage {
        constructor(...args) {
            super(...args);

            mockStateStorage = this; // eslint-disable-line consistent-this

            jest.spyOn(this, 'save');
            jest.spyOn(this, 'read');
        }
    }

    return SpiedStateStorage;
});

beforeAll(() => {
    history.scrollRestoration = 'auto';
});

afterEach(() => {
    mockStateStorage = undefined;
    scrollBehavior?.stop();
    window.pageYOffset = 0;
    jest.clearAllMocks();
});

describe('constructor()', () => {
    beforeAll(() => {
        Object.defineProperty(navigator, 'userAgent', { value: navigator.userAgent, writable: true });
        Object.defineProperty(navigator, 'platform', { value: navigator.platform, writable: true });
    });

    it('should setup router', () => {
        const beforePopState = Router.beforePopState;

        scrollBehavior = new NextScrollBehavior();

        expect(Router.beforePopState).not.toBe(beforePopState);
    });

    it('should setup listeners', () => {
        scrollBehavior = new NextScrollBehavior();

        expect(window.addEventListener).toHaveBeenCalledTimes(1);
        expect(window.removeEventListener).toHaveBeenCalledTimes(0);
        expect(Router.events.on).toHaveBeenCalledTimes(1);
        expect(Router.events.off).toHaveBeenCalledTimes(0);
    });

    it('should forward shouldUpdateScroll to ScrollBehavior', () => {
        const shouldUpdateScroll = () => {};

        scrollBehavior = new NextScrollBehavior(shouldUpdateScroll);

        expect(scrollBehavior._shouldUpdateScroll).toBe(shouldUpdateScroll);
    });

    it('should forward restoreSameLocation to StateStorage', () => {
        scrollBehavior = new NextScrollBehavior(() => {}, true);

        expect(mockStateStorage.restoreSameLocation).toBe(true);
    });

    it('should set history.scrollRestoration to manual, even on Safari iOS', () => {
        // eslint-disable-next-line max-len
        navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/605.1';
        navigator.platform = 'iPhone';

        scrollBehavior = new NextScrollBehavior();

        expect(history.scrollRestoration).toBe('manual');
    });

    it('should set current context correctly', () => {
        Router.pathname = '/bar';
        Router.asPath = '/bar';
        Router.query = {};

        const router = pick(Router, 'pathname', 'asPath', 'query');

        scrollBehavior = new NextScrollBehavior();

        expect(scrollBehavior._context).toEqual({ location, router });
        expect(scrollBehavior._prevContext).toBe(null);
    });
});

describe('stop()', () => {
    it('should unregister all elements when stopping', () => {
        scrollBehavior = new NextScrollBehavior();

        jest.spyOn(scrollBehavior, 'unregisterElement');

        scrollBehavior.registerElement('foo', document.createElement('div'));
        scrollBehavior.stop();

        expect(scrollBehavior.unregisterElement).toHaveBeenCalledTimes(1);
    });

    it('should cancel all ongoing _setPosition debouncers', async () => {
        scrollBehavior = new NextScrollBehavior();

        expect(mockStateStorage.save).toHaveBeenCalledTimes(0);

        window.dispatchEvent(new CustomEvent('scroll'));

        await sleep(30);

        window.dispatchEvent(new CustomEvent('scroll'));

        await sleep(30);

        scrollBehavior.stop();

        await sleep(200);

        expect(mockStateStorage.save).toHaveBeenCalledTimes(1);
    });

    it('should call super', () => {
        const scrollBehavior = new NextScrollBehavior();

        expect(window.removeEventListener).toHaveBeenCalledTimes(0);
        expect(Router.events.off).toHaveBeenCalledTimes(0);

        scrollBehavior.stop();

        expect(window.removeEventListener).toHaveBeenCalledTimes(1);
        expect(Router.events.off).toHaveBeenCalledTimes(1);
    });
});

describe('updateScroll()', () => {
    it('should inject prevContext and context', () => {
        const shouldUpdateScroll = jest.fn(() => false);

        Router.pathname = '/';
        Router.asPath = '/?foo=1';
        Router.query = { foo: '1' };

        scrollBehavior = new NextScrollBehavior(shouldUpdateScroll);
        scrollBehavior.updateScroll();

        const router1 = pick(Router, 'pathname', 'asPath', 'query');

        expect(shouldUpdateScroll).toHaveBeenNthCalledWith(
            1,
            null,
            { location: expect.any(Location), router: router1 },
        );

        Router.pathname = '/bar';
        Router.asPath = '/bar';
        Router.query = {};

        Router.events.emit('routeChangeComplete');
        scrollBehavior.updateScroll();

        const router2 = pick(Router, 'pathname', 'asPath', 'query');

        expect(shouldUpdateScroll).toHaveBeenNthCalledWith(
            2,
            { location: expect.any(Location), router: router1 },
            { location: expect.any(Location), router: router2 },
        );
    });

    it('should shallow merge prevContext and context', () => {
        const shouldUpdateScroll = jest.fn(() => false);

        Router.pathname = '/';
        Router.asPath = '/?foo=1';
        Router.query = { foo: '1' };

        scrollBehavior = new NextScrollBehavior(shouldUpdateScroll);
        scrollBehavior.updateScroll({ foo: 'bar' }, { foz: 'baz' });

        const router = pick(Router, 'pathname', 'asPath', 'query');

        expect(shouldUpdateScroll).toHaveBeenNthCalledWith(
            1,
            { foo: 'bar' },
            { foz: 'baz', location: expect.any(Location), router },
        );
    });

    it('should call super', () => {
        const shouldUpdateScroll = jest.fn(() => false);

        scrollBehavior = new NextScrollBehavior(shouldUpdateScroll);
        scrollBehavior.updateScroll();

        expect(shouldUpdateScroll).toHaveBeenCalledTimes(1);
    });
});

describe('registerElement()', () => {
    it('should inject context', () => {
        const element = document.createElement('div');
        const shouldUpdateScroll = jest.fn(() => false);

        scrollBehavior = new NextScrollBehavior(shouldUpdateScroll);
        scrollBehavior.registerElement('foo', element, shouldUpdateScroll);

        const router = pick(Router, 'pathname', 'asPath', 'query');

        expect(shouldUpdateScroll).toHaveBeenCalledTimes(1);
        expect(shouldUpdateScroll).toHaveBeenNthCalledWith(
            1,
            null,
            { location: expect.any(Location), router },
        );
    });

    it('should shallow merge context', () => {
        const element = document.createElement('div');
        const shouldUpdateScroll = jest.fn(() => false);

        scrollBehavior = new NextScrollBehavior(shouldUpdateScroll);
        scrollBehavior.registerElement('foo', element, shouldUpdateScroll, { foo: 'bar' });

        const router = pick(Router, 'pathname', 'asPath', 'query');

        expect(shouldUpdateScroll).toHaveBeenCalledTimes(1);
        expect(shouldUpdateScroll).toHaveBeenNthCalledWith(
            1,
            null,
            { foo: 'bar', location: expect.any(Location), router },
        );
    });

    it('should call super', () => {
        const element = document.createElement('div');

        scrollBehavior = new NextScrollBehavior();
        scrollBehavior.registerElement('foo', element);

        expect(scrollBehavior._scrollElements.foo).toBeTruthy();
    });
});

describe('unregisterElement()', () => {
    it('should cancel all ongoing _setPosition debouncers', async () => {
        const element = document.createElement('div');

        scrollBehavior = new NextScrollBehavior();
        scrollBehavior.registerElement('foo', element);

        expect(mockStateStorage.save).toHaveBeenCalledTimes(0);

        element.dispatchEvent(new CustomEvent('scroll'));

        await sleep(30);

        element.dispatchEvent(new CustomEvent('scroll'));

        await sleep(30);

        scrollBehavior.unregisterElement('foo');

        await sleep(200);

        expect(mockStateStorage.save).toHaveBeenCalledTimes(1);
    });

    it('should be idempotent', () => {
        scrollBehavior = new NextScrollBehavior();

        expect(() => scrollBehavior.unregisterElement('foo')).not.toThrow();
    });

    it('should call super', () => {
        const element = document.createElement('div');

        scrollBehavior = new NextScrollBehavior();
        scrollBehavior.registerElement('foo', element);

        scrollBehavior.unregisterElement('foo');

        expect(scrollBehavior._scrollElements.foo).toBe(undefined);
    });
});

describe('on route change complete', () => {
    it('should update prevContext and context', () => {
        Router.pathname = '/';
        Router.asPath = '/?foo=1';
        Router.query = { foo: '1' };

        const router1 = pick(Router, 'pathname', 'asPath', 'query');

        scrollBehavior = new NextScrollBehavior();

        Router.pathname = '/bar';
        Router.asPath = '/bar';
        Router.query = {};

        const router2 = pick(Router, 'pathname', 'asPath', 'query');

        Router.events.emit('routeChangeComplete');

        expect(scrollBehavior._context).toEqual({ location: expect.any(Location), router: router2 });
        expect(scrollBehavior._prevContext).toEqual({ location: expect.any(Location), router: router1 });
    });

    it('should not save scroll position', async () => {
        scrollBehavior = new NextScrollBehavior();

        Router.events.emit('routeChangeComplete');

        await sleep(50);

        expect(mockStateStorage.save).toHaveBeenCalledTimes(0);
    });
});

it('should update scroll correctly based on history changes', async () => {
    scrollBehavior = new NextScrollBehavior();

    jest.spyOn(scrollBehavior, 'scrollToTarget');
    Object.defineProperty(scrollBehavior, '_numWindowScrollAttempts', {
        get: () => 1000,
        set: () => {},
    });

    // First page
    history.replaceState({ as: '/' }, '', '/');
    Router.events.emit('routeChangeComplete', '/');
    window.pageYOffset = 0;
    scrollBehavior.updateScroll();

    await sleep(10);

    expect(scrollBehavior.scrollToTarget).toHaveBeenNthCalledWith(1, window, [0, 0]);

    // Navigate to new page & scroll
    history.pushState({ as: '/page2' }, '', '/page2');
    Router.events.emit('routeChangeComplete', '/');
    window.pageYOffset = 123;
    window.dispatchEvent(new CustomEvent('scroll'));

    await sleep(200);

    scrollBehavior.updateScroll();

    expect(scrollBehavior.scrollToTarget).toHaveBeenNthCalledWith(2, window, [0, 123]);

    // Go to previous page
    history.back();
    Router.events.emit('routeChangeComplete', '/');
    await sleep(10);

    location.key = history.state.locationKey;
    scrollBehavior.updateScroll();

    expect(scrollBehavior.scrollToTarget).toHaveBeenNthCalledWith(3, window, [0, 0]);

    // Go to next page
    history.forward();
    Router.events.emit('routeChangeComplete', '/');
    await sleep(10);

    location.key = history.state.locationKey;
    scrollBehavior.updateScroll();

    expect(scrollBehavior.scrollToTarget).toHaveBeenNthCalledWith(4, window, [0, 123]);
});

it('should restore scroll position if same url is opened', async () => {
    scrollBehavior = new NextScrollBehavior(undefined, true);

    jest.spyOn(scrollBehavior, 'scrollToTarget');
    Object.defineProperty(scrollBehavior, '_numWindowScrollAttempts', {
        get: () => 1000,
        set: () => {},
    });

    // First page
    history.replaceState({ as: '/' }, '', '/');
    Router.events.emit('routeChangeComplete', '/');
    window.pageYOffset = 0;
    scrollBehavior.updateScroll();

    await sleep(10);

    expect(scrollBehavior.scrollToTarget).toHaveBeenNthCalledWith(1, window, [0, 0]);

    // Navigate to new page & scroll
    history.pushState({ as: '/page2' }, '', '/page2');
    Router.events.emit('routeChangeComplete', '/');
    window.pageYOffset = 123;
    window.dispatchEvent(new CustomEvent('scroll'));

    await sleep(200);

    scrollBehavior.updateScroll();

    expect(scrollBehavior.scrollToTarget).toHaveBeenNthCalledWith(2, window, [0, 123]);

    // Go to previous page
    history.pushState({ as: '/' }, '', '/');
    Router.events.emit('routeChangeComplete', '/');
    await sleep(10);

    location.key = history.state.locationKey;
    scrollBehavior.updateScroll();

    expect(scrollBehavior.scrollToTarget).toHaveBeenNthCalledWith(3, window, [0, 0]);

    // Go to next page
    history.pushState({ as: '/page2' }, '', '/page2');
    Router.events.emit('routeChangeComplete', '/');
    await sleep(10);

    location.key = history.state.locationKey;
    scrollBehavior.updateScroll();

    expect(scrollBehavior.scrollToTarget).toHaveBeenNthCalledWith(4, window, [0, 123]);
});
