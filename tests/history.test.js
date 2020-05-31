import setupHistory from '../src/history';

setupHistory();

it('should handle pushState correctly', () => {
    const pushStateSpy = jest.spyOn(window.history, 'pushState');

    window.history.pushState({}, '', '/foo');

    expect(pushStateSpy).toHaveBeenCalledWith({ locationKey: expect.any(String) }, '', '/foo');
});

it('should handle replaceState correctly', () => {
    const replaceStateSpy = jest.spyOn(window.history, 'replaceState');

    window.history.replaceState({}, '', '/foo');

    expect(replaceStateSpy).toHaveBeenCalledWith({ locationKey: expect.any(String) }, '', '/foo');
});

it('should handle pushState correctly when history state is defined', () => {
    const pushStateSpy = jest.spyOn(window.history, 'pushState');

    window.history.state.as = '/foobar';

    window.history.pushState({ }, '', '/foobar');

    expect(pushStateSpy).toHaveBeenCalledWith({ locationKey: expect.any(String) }, '', '/foobar');
});

it('should handle replaceState correctly when history state is defined', () => {
    const replaceStateSpy = jest.spyOn(window.history, 'replaceState');

    window.history.state.as = '/foobar';

    window.history.replaceState({ }, '', '/foobar');

    expect(replaceStateSpy).toHaveBeenCalledWith({ locationKey: expect.any(String) }, '', '/foobar');
});

