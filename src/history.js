import { wrap } from 'lodash';

const createKey = () => Math.random()
    .toString(36)
    .substr(2, 8);

const setupHistory = () => {
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
};

export default setupHistory;
