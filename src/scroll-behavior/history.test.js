import Router from 'next/router';
import { setupHistory, setupRouter } from './history';

describe('setupHistory()', () => {
    beforeAll(() => {
        setupHistory();
    });

    it('should setup just once', () => {
        const pushState = history.pushState;

        setupHistory();

        expect(history.pushState).toBe(pushState);
    });

    it('should handle pushState correctly', () => {
        const pushStateSpy = jest.spyOn(history, 'pushState');

        history.pushState({}, '', '/foo');

        expect(pushStateSpy).toHaveBeenCalledWith({ locationKey: expect.any(String) }, '', '/foo');
    });

    it('should handle replaceState correctly', () => {
        const replaceStateSpy = jest.spyOn(history, 'replaceState');

        history.replaceState({}, '', '/foo');

        expect(replaceStateSpy).toHaveBeenCalledWith({ locationKey: expect.any(String) }, '', '/foo');
    });

    it('should handle pushState correctly when history state is defined', () => {
        const pushStateSpy = jest.spyOn(history, 'pushState');

        history.state.as = '/foobar';

        history.pushState({ }, '', '/foobar');

        expect(pushStateSpy).toHaveBeenCalledWith({ locationKey: expect.any(String) }, '', '/foobar');
    });

    it('should handle replaceState correctly when history state is defined', () => {
        const replaceStateSpy = jest.spyOn(history, 'replaceState');

        history.state.as = '/foobar';

        history.replaceState({ }, '', '/foobar');

        expect(replaceStateSpy).toHaveBeenCalledWith({ locationKey: expect.any(String) }, '', '/foobar');
    });
});

describe('setupRouter()', () => {
    let originalBeforePopStateSpy;

    beforeAll(() => {
        jest.spyOn(Router, 'beforePopState');
        originalBeforePopStateSpy = Router.beforePopState;

        setupRouter();
    });

    it('should setup just once', () => {
        const beforePopState = Router.beforePopState;

        setupRouter();

        expect(Router.beforePopState).toBe(beforePopState);
    });

    it('should hook into beforePopState to set location.key', () => {
        const fn = originalBeforePopStateSpy.mock.calls[0][0];

        fn({ locationKey: 'foo' });

        expect(location.key).toBe('foo');
    });
});
