import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import Link from 'next/link';
import RouterScrollContext from './context';
import RouterScrollProvider from './RouterScrollProvider';

let mockNextScrollBehavior;
let mockStateStorage;

jest.mock('./scroll-behavior', () => {
    const NextScrollBehavior = jest.requireActual('./scroll-behavior');

    class SpiedNextScrollBehavior extends NextScrollBehavior {
        constructor(...args) {
            super(...args);

            mockNextScrollBehavior = this; // eslint-disable-line consistent-this

            jest.spyOn(this, 'updateScroll');
            jest.spyOn(this, 'registerElement');
            jest.spyOn(this, 'unregisterElement');
            jest.spyOn(this, 'stop');
        }
    }

    return SpiedNextScrollBehavior;
});

jest.mock('./scroll-behavior/StateStorage', () => {
    const StateStorage = jest.requireActual('./scroll-behavior/StateStorage');

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

afterEach(() => {
    mockNextScrollBehavior = undefined;
});

it('should provide a facade to the scroll behavior instance', () => {
    expect.assertions(7);

    const MyComponent = () => {
        const routerScroll = useContext(RouterScrollContext);

        expect(routerScroll).toEqual({
            updateScroll: expect.any(Function),
            registerElement: expect.any(Function),
            unregisterElement: expect.any(Function),
        });

        mockNextScrollBehavior.updateScroll.mockImplementation(() => {});
        mockNextScrollBehavior.registerElement.mockImplementation(() => {});
        mockNextScrollBehavior.unregisterElement.mockImplementation(() => {});

        routerScroll.updateScroll({ foo: 'foo' }, { bar: 'bar' });
        routerScroll.registerElement('foo', document.createElement('div'));
        routerScroll.unregisterElement('foo');

        expect(mockNextScrollBehavior.updateScroll).toHaveBeenCalledTimes(1);
        expect(mockNextScrollBehavior.updateScroll).toHaveBeenNthCalledWith(1, { foo: 'foo' }, { bar: 'bar' });
        expect(mockNextScrollBehavior.registerElement).toHaveBeenCalledTimes(1);
        expect(mockNextScrollBehavior.registerElement).toHaveBeenNthCalledWith(1, 'foo', expect.any(HTMLDivElement));
        expect(mockNextScrollBehavior.unregisterElement).toHaveBeenCalledTimes(1);
        expect(mockNextScrollBehavior.unregisterElement).toHaveBeenNthCalledWith(1, 'foo');

        return null;
    };

    render(
        <RouterScrollProvider>
            <MyComponent />
        </RouterScrollProvider>,
    );
});

it('should disable scroll in Next\'s Link', () => {
    const MyComponent = () => null;

    expect(Link.defaultProps).toBe(undefined);

    const { unmount } = render(
        <RouterScrollProvider>
            <MyComponent />
        </RouterScrollProvider>,
    );

    expect(Link.defaultProps.scroll).toBe(false);

    unmount();

    expect(Link.defaultProps).toBe(undefined);
});

it('should not disable scroll in Next\'s Link if disableNextLinkScroll is false', () => {
    const MyComponent = () => null;

    expect(Link.defaultProps).toBe(undefined);

    const { unmount } = render(
        <RouterScrollProvider disableNextLinkScroll={ false }>
            <MyComponent />
        </RouterScrollProvider>,
    );

    expect(Link.defaultProps).toBe(undefined);

    unmount();

    expect(Link.defaultProps).toBe(undefined);
});

it('should call scrollBehavior\'s stop when unmounting', () => {
    const MyComponent = () => null;

    const { unmount } = render(
        <RouterScrollProvider>
            <MyComponent />
        </RouterScrollProvider>,
    );

    unmount();

    expect(mockNextScrollBehavior.stop).toHaveBeenCalledTimes(1);
});

it('should memoize the provider value', () => {
    const routerScrolls = [];

    const MyComponent = () => {
        const routerScroll = useContext(RouterScrollContext);

        routerScrolls.push(routerScroll);

        return null;
    };

    const { rerender } = render(
        <RouterScrollProvider>
            <MyComponent />
        </RouterScrollProvider>,
    );

    rerender(
        <RouterScrollProvider>
            <MyComponent />
        </RouterScrollProvider>,
    );

    expect(routerScrolls).toHaveLength(2);
    expect(routerScrolls[0]).toBe(routerScrolls[1]);
});

it('should allow changing shouldUpdateScroll', () => {
    const shouldUpdateScroll1 = jest.fn(() => false);
    const shouldUpdateScroll2 = jest.fn(() => false);

    const MyComponent = () => {
        const { updateScroll } = useContext(RouterScrollContext);

        updateScroll();

        return null;
    };

    const { rerender } = render(
        <RouterScrollProvider shouldUpdateScroll={ shouldUpdateScroll1 }>
            <MyComponent />
        </RouterScrollProvider>,
    );

    expect(shouldUpdateScroll1).toHaveBeenCalledTimes(1);
    expect(shouldUpdateScroll2).toHaveBeenCalledTimes(0);

    rerender(
        <RouterScrollProvider shouldUpdateScroll={ shouldUpdateScroll2 }>
            <MyComponent />
        </RouterScrollProvider>,
    );

    expect(shouldUpdateScroll1).toHaveBeenCalledTimes(1);
    expect(shouldUpdateScroll2).toHaveBeenCalledTimes(1);
});

it('allows setting restoreSameLocation', () => {
    const MyComponent = () => {
        useContext(RouterScrollContext);

        return null;
    };

    render(
        <RouterScrollProvider>
            <MyComponent />
        </RouterScrollProvider>,
    );

    expect(mockStateStorage.restoreSameLocation).toBe(false);

    render(
        <RouterScrollProvider restoreSameLocation>
            <MyComponent />
        </RouterScrollProvider>,
    );

    expect(mockStateStorage.restoreSameLocation).toBe(true);
});

it('allows changing restoreSameLocation', () => {
    const MyComponent = () => {
        useContext(RouterScrollContext);

        return null;
    };

    const { rerender } = render(
        <RouterScrollProvider>
            <MyComponent />
        </RouterScrollProvider>,
    );

    expect(mockStateStorage.restoreSameLocation).toBe(false);

    rerender(
        <RouterScrollProvider restoreSameLocation>
            <MyComponent />
        </RouterScrollProvider>,
    );

    expect(mockStateStorage.restoreSameLocation).toBe(true);
});
