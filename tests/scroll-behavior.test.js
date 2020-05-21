import Link from 'next/link';
import getScrollBehavior from '../src/scroll-behavior';

let scrollBehavior;

afterEach(() => {
    window.pageYOffset = 0;
});

it('should updateScroll correctly', () => {
    scrollBehavior = getScrollBehavior();

    const scrollToSpy = jest.fn();

    window.scrollTo = scrollToSpy;

    scrollBehavior.updateScroll();

    expect(Link.defaultProps).toStrictEqual({ scroll: false });
    expect(scrollToSpy).toHaveBeenCalledTimes(2);
    expect(scrollToSpy).toHaveBeenNthCalledWith(1, 0, 0);
    expect(scrollToSpy).toHaveBeenNthCalledWith(2, 0, 0);
});

it('should updateScroll with the right values after a scroll', () => {
    scrollBehavior = getScrollBehavior();

    const scrollToSpy = jest.fn();

    window.scrollTo = scrollToSpy;

    window.pageYOffset = 200;

    scrollBehavior.updateScroll();

    expect(scrollToSpy).toHaveBeenNthCalledWith(1, 0, 200);
});

it('should updateScroll correctly based on history state', () => {
    scrollBehavior = getScrollBehavior();

    const scrollToSpy = jest.fn();

    window.scrollTo = scrollToSpy;

    window.history.replaceState({ as: '/', url: '/' }, '', '/');
    scrollBehavior.updateScroll();

    expect(scrollToSpy).toHaveBeenNthCalledWith(1, 0, 0);

    // Push New Page
    window.history.pushState({ as: '/page2' }, '', '/page2');
    window.pageYOffset = 123;
    scrollBehavior.updateScroll();

    // Go To Previous Page
    window.history.replaceState({ as: '/', url: '/' }, '', '/');
    scrollBehavior.updateScroll();
    expect(scrollToSpy).toHaveBeenNthCalledWith(4, 0, 0);

    // Replace with page two with updated scroll
    window.history.replaceState({ as: '/page2', url: '/page2' }, '', '/page2');
    scrollBehavior.updateScroll();

    expect(scrollToSpy).toHaveBeenNthCalledWith(7, 0, 123);
});

it('should call stop function correctly and restore Link scroll ', () => {
    scrollBehavior = getScrollBehavior();

    scrollBehavior.stop();

    expect(Link.defaultProps).toStrictEqual({ scroll: true });
});

it('should return the same instance of getScrollBehavior ', () => {
    scrollBehavior = getScrollBehavior();
    const aScrollBehavior = getScrollBehavior();

    expect(scrollBehavior).toBe(aScrollBehavior);

    aScrollBehavior.stop();

    const anotherScrollBehavior = getScrollBehavior();

    expect(aScrollBehavior).not.toBe(anotherScrollBehavior);
});
