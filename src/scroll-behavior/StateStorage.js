/* istanbul ignore file */
import { readState, saveState } from 'history/lib/DOMStateStorage';
import md5 from 'md5';

const STATE_KEY_PREFIX = '@@scroll|';

const hashLocation = (location) => md5(`${location.host}${location.pathname}${location.hash}${location.search}`);

export default class StateStorage {
    restoreSameLocation;

    constructor({ restoreSameLocation }) {
        this.restoreSameLocation = restoreSameLocation || false;
    }

    read(location, key) {
        return readState(this.getStateKey(location, key));
    }

    save(location, key, value) {
        saveState(this.getStateKey(location, key), value);
    }

    getStateKey(location, key) {
        const locationKey = this.restoreSameLocation ? hashLocation(location) : (location.key ?? '_default');

        const stateKeyBase = `${STATE_KEY_PREFIX}${locationKey}`;

        return key == null ? stateKeyBase : `${stateKeyBase}|${key}`;
    }
}
