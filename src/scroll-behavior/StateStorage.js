/* istanbul ignore file */
import { readState, saveState } from 'history/lib/DOMStateStorage';

const STATE_KEY_PREFIX = '@@scroll|';

export default class StateStorage {
    read(location, key) {
        return readState(this.getStateKey(location, key));
    }

    save(location, key, value) {
        saveState(this.getStateKey(location, key), value);
    }

    getStateKey(location, key) {
        const locationKey = location.key ?? '_default';
        const stateKeyBase = `${STATE_KEY_PREFIX}${locationKey}`;

        return key == null ? stateKeyBase : `${stateKeyBase}|${key}`;
    }
}
