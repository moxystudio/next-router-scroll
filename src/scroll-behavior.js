import { wrap } from 'lodash';
import ScrollBehavior from 'scroll-behavior';
import Router from 'next/router';
import Link from 'next/link';
import setupHistory from './history';
import StateStorage from './StateStorage';

/* istanbul ignore next*/
if (typeof window !== 'undefined') {
    setupHistory();
}

const stateStorage = new StateStorage();
const scrollBehaviorSymbol = Symbol('scrollBehavior');

const getScrollBehavior = (options) => {
    options = {
        disableNextLinkScroll: true,
        ...options,
    };

    if (Router[scrollBehaviorSymbol]) {
        return Router[scrollBehaviorSymbol];
    }

    Router.beforePopState = wrap(Router.beforePopState, (beforePopState, fn) => {
        /* istanbul ignore next*/
        fn = wrap(fn, (fn, state) => {
            location.key = state.locationKey;

            return fn(state);
        });

        return beforePopState.call(Router, fn);
    });

    Router.beforePopState(() => true);

    const scrollBehavior = new ScrollBehavior({
        addTransitionHook: (callback) => {
            Link.defaultProps = {
                ...Link.defaultProps,
                scroll: !options.disableNextLinkScroll,
            };
            Router.events.on('routeChangeStart', callback);

            return () => {
                Link.defaultProps = {
                    ...Link.defaultProps,
                    scroll: true,
                };
                Router.events.off('routeChangeStart', callback);

                delete Router[scrollBehaviorSymbol];
            };
        },
        getCurrentLocation: () => location,
        stateStorage,
    });

    Router[scrollBehaviorSymbol] = scrollBehavior;

    return scrollBehavior;
};

export default getScrollBehavior;
