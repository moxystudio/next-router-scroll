import { wrap } from 'lodash';
import Router from 'next/router';

const symbol = Symbol('@moxy/next-router-scroll');

const createKey = () => Math.random()
    .toString(36)
    .substr(2, 8);

export const setupHistory = () => {
    if (history[symbol]) {
        return;
    }

    history.pushState = wrap(history.pushState, (pushState, state, title, url) => {
        /* istanbul ignore else*/
        if (state) {
            if (history.state?.as !== url) {
                state.locationKey = createKey();
                location.key = state.locationKey;
            } else {
                state.locationKey = location.key;
            }
        }

        pushState.call(history, state, title, url);
    });

    history.replaceState = wrap(history.replaceState, (replaceState, state, title, url) => {
        /* istanbul ignore else*/
        if (state) {
            if (history.state?.as !== url) {
                state.locationKey = createKey();
                location.key = state.locationKey;
            } else {
                state.locationKey = location.key;
            }
        }

        replaceState.call(history, state, title, url);
    });

    Object.defineProperty(history, symbol, { value: true });
};

export const setupRouter = () => {
    if (Router[symbol]) {
        return;
    }

    Router.beforePopState = wrap(Router.beforePopState, (beforePopState, fn) => {
        fn = wrap(fn, (fn, state) => {
            location.key = state.locationKey;

            return fn(state);
        });

        return beforePopState.call(Router, fn);
    });

    Router.beforePopState(() => true);

    Object.defineProperty(Router, symbol, { value: true });
};
