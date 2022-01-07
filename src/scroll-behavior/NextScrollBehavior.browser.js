import { debounce, pick } from 'lodash';
import ScrollBehavior from 'scroll-behavior';
import Router from 'next/router';
import { setupHistory, setupRouter } from './history';
import StateStorage from './StateStorage';

setupHistory();

const SAVE_POSITION_DEBOUNCE_TIME = 150;

export default class NextScrollBehavior extends ScrollBehavior {
    _context;
    _prevContext;
    _debounceSavePositionMap = new Map();
    _stateStorage;

    constructor(shouldUpdateScroll, restoreSameLocation = false) {
        setupRouter();
        const stateStorage = new StateStorage({ restoreSameLocation });

        super({
            addNavigationListener: (callback) => {
                const handleRouteChangeComplete = () => {
                    this._prevContext = this._context;
                    this._context = this._createContext();

                    // Call callback but do not save scroll position as it's too early.
                    // `scroll-behavior@0.9.x` didn't had this behavior, but newer versions have..
                    this._cleanupDebouncedSavePosition();
                    this.startIgnoringScrollEvents();
                    callback({});
                    this.stopIgnoringScrollEvents();
                };

                Router.events.on('routeChangeComplete', handleRouteChangeComplete);

                return () => {
                    Router.events.off('routeChangeComplete', handleRouteChangeComplete);
                };
            },
            getCurrentLocation: () => this._context.location,
            stateStorage,
            shouldUpdateScroll,
        });

        this._stateStorage = stateStorage;
        this._context = this._createContext();
        this._prevContext = null;

        // Make sure to use our implementation of _setScrollRestoration as the original one,
        // ignores iOS due to a old bug that seems to be fixed.
        // See: https://github.com/gatsbyjs/gatsby/issues/11355 and https://github.com/taion/scroll-behavior/issues/128
        this._setScrollRestoration = this._setScrollRestorationWithoutUserAgentSniffing;
        this._setScrollRestoration();
    }

    updateScroll(prevContext, context) {
        prevContext = this._prevContext == null && prevContext == null ? null : {
            ...this._prevContext,
            ...prevContext,
        };
        context = {
            ...this._context,
            ...context,
        };

        super.updateScroll(prevContext, context);
    }

    setRestoreSameLocation(newValue = false) {
        this._stateStorage.restoreSameLocation = newValue;
    }

    stop() {
        super.stop();

        this._cleanupDebouncedSavePosition();

        // Need to unregister elements since ScrollBehavior doesn't do that for us.
        // See: https://github.com/taion/scroll-behavior/issues/406
        Object.keys(this._scrollElements).forEach((key) => this.unregisterElement(key));
    }

    registerElement(key, element, shouldUpdateScroll, context) {
        context = {
            ...this._context,
            ...context,
        };

        super.registerElement(key, element, shouldUpdateScroll, context);
    }

    unregisterElement(key) {
        // Make the function idempotent instead of throwing, so that it plays better in React and fast refresh.
        if (!this._scrollElements[key]) {
            return;
        }

        super.unregisterElement(key);

        // Cleanup ongoing debounce if any.
        const savePosition = this._debounceSavePositionMap.get(key);

        if (savePosition) {
            savePosition.cancel();
            this._debounceSavePositionMap.delete(key);
        }
    }

    _createContext() {
        return { location, router: pick(Router, 'pathname', 'asPath', 'query') };
    }

    _setScrollRestorationWithoutUserAgentSniffing() {
        if (this._oldScrollRestoration) {
            return;
        }

        if ('scrollRestoration' in history) {
            this._oldScrollRestoration = history.scrollRestoration;

            try {
                history.scrollRestoration = 'manual';
            } catch (e) {
                this._oldScrollRestoration = null;
            }
        }
    }

    _savePosition(key, element) {
        // Override _savePosition so that writes to storage are debounced.
        // See: https://github.com/taion/scroll-behavior/issues/136
        let savePosition = this._debounceSavePositionMap.get(key);

        if (!savePosition) {
            savePosition = debounce(
                super._savePosition.bind(this),
                SAVE_POSITION_DEBOUNCE_TIME,
                { leading: true },
            );

            this._debounceSavePositionMap.set(key, savePosition);
        }

        savePosition(key, element);
    }

    _cleanupDebouncedSavePosition() {
        this._debounceSavePositionMap.forEach((savePosition) => savePosition.cancel());
        this._debounceSavePositionMap.clear();
    }
}
