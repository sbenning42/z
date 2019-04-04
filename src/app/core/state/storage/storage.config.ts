import { Schemas, Schema, Action } from '../../z/core/types';
import { createAsyncActionConfig } from '../../z/core/config-factories';

export const STORAGE = 'STORAGE';

export interface Entries {
    [x: string]: any;
}

export interface StorageState {
    loaded: boolean;
    entries: Entries;
}

export interface StorageSchema extends Schemas {
    get: Schema<void, Entries>;
    save: Schema<Entries, Entries>;
    remove: Schema<string[], string[]>;
    clear: Schema<void, {}>;
}

export const initialStorageState: StorageState = {
    loaded: false,
    entries: null,
};

export const storageActionsConfig = {
    get: createAsyncActionConfig('[STORAGE] Get', false),
    save: createAsyncActionConfig('[STORAGE] Save'),
    remove: createAsyncActionConfig('[STORAGE] Remove'),
    clear: createAsyncActionConfig('[STORAGE] Clear', false),
};

export const storageReducersConfig = {
    get: { response: (state: StorageState, { payload }: Action<Entries>) => ({ ...state, loaded: true, entries: payload }) },
    save: { response: (state: StorageState, { payload }: Action<Entries>) => ({ ...state, entries: { ...state.entries, ...payload } }) },
    remove: { response: (state: StorageState, { payload }: Action<string[]>) => ({
        ...state,
        entries: Object.keys(state.entries)
            .filter(key => !payload.includes(key))
            .reduce((E, key) => ({ ...E, [key]: state.entries[key] }), {})
    }) },
    clear: { response: (state: StorageState) => ({ ...state, entries: {} }) },
};
