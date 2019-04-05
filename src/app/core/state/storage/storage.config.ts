import {
    ActionsSchema,
    ActionSchema,
    ActionConfig,
    StoreConfig
} from "../../zto";

// Inner state interfaces
export interface Entries {
    [x: string]: any;
}

// State interface
export interface StorageState {
    loaded: boolean;
    entries: Entries;
}

// State actions schemas
// an ActionSchema can be one of:
//      - ActionSchema (Action is synchronous and it does not need a payload)
//      - ActionSchema<any> (Action is synchronous and it does need a payload of type 'any')
//      - ActionSchema<void, any> (Action is asynchronous, it does not need a payload and the response is of type 'any')
//      - ActionSchema<any, any> (Action is asynchronous, it does need a payload of type 'any' and the response is of type 'any')
export interface StorageSchema extends ActionsSchema {
    get: ActionSchema<void, Entries>;
    save: ActionSchema<Entries, Entries>;
    remove: ActionSchema<string[], string[]>;
    clear: ActionSchema<void, {}>;
}

export const storageConfig = () => new StoreConfig<StorageState, StorageSchema>(

    // Store selector
    'STORAGE',

    // Store initial state
    {
        loaded: false,
        entries: null
    },

    // All possible store actions
    {

        get: new ActionConfig(
            '[STORAGE] Get',
            {
                response: (state, { payload }) => ({
                    ...state,
                    loaded: true,
                    entries: payload
                }),
            }
        ),

        save: new ActionConfig(
            '[STORAGE] Save',
            {
                response: (state, { payload }) => ({
                    ...state,
                    entries: {
                        ...state.entries,
                        ...payload
                    }
                }),
            }
        ),

        remove: new ActionConfig(
            '[STORAGE] Remove',
            {
                response: (state, { payload }) => ({
                    ...state,
                    entries: Object.entries(state.entries)
                        .filter(([key]) => !payload.includes(key))
                        .reduce((entries, [key, value]) => ({ ...entries, [key]: value }), {})
                }),
            }
        ),

        clear: new ActionConfig(
            '[STORAGE] Clear',
            {
                response: state => ({
                    ...state,
                    entries: {}
                }),
            }
        ),

    }
);
