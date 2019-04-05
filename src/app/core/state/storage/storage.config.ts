import {
    ActionsSchema,
    ActionSchema,
    AsyncActionWithoutPayloadConfig,
    AsyncActionWithPayloadConfig,
    StoreConfig
} from "../../zto";

// Helper interfaces for this State
export interface Entries {
    [x: string]: any;
}

// State interface
// NOTE: a State interface MUST NOT HAVE a 'state' property
export interface StorageState {
    loaded: boolean;
    entries: Entries;
}

// State actions schemas
// an ActionSchema can be one of:
//      - ActionSchema (Action is synchronous and it does not need a payload)
//      - ActionSchema<T> (Action is synchronous and it does need a payload of type T)
//      - ActionSchema<void, U> (Action is asynchronous, it does not need a payload and the response is of type U)
//      - ActionSchema<T, U> (Action is asynchronous, it does need a payload of type T and the response is of type U)
// NOTE: An asynchronous action must have a response type != (null | undefined | void) // pass {} instead 
export interface StorageSchema extends ActionsSchema {
    get: ActionSchema<void, Entries>;
    save: ActionSchema<Entries, Entries>;
    remove: ActionSchema<string[], string[]>;
    clear: ActionSchema<void, {}>;
}

export const storageConfig = () => new StoreConfig<StorageState, StorageSchema>(

    // Store selector (must be UNIQUE)
    'STORAGE',

    // Store initial state
    {
        loaded: false,
        entries: null
    },

    // All possible store actions
    {

        // You can choose between SyncActionWithoutPayloadConfig, SyncActionWithPayloadConfig,
        // AsyncActionWithoutPayloadConfig and AsyncActionWithPayloadConfig factory functions
        // to easily create action's config
        // type parameters are optional but, they can infer types for reducer functions
        // this can be really handy
        get: new AsyncActionWithoutPayloadConfig<StorageState, StorageSchema['get']>(
            // Choose it an UNIQUE name
            '[STORAGE] Get',
            // If it's a synchronous action, directly pass it the reducer
            // If it's an async one, give it an object we up to four properties
            // from request, response, error and cancel associated with the particular reducer you want to call
            {
                response: (state, { payload }) => ({
                    loaded: true,
                    entries: payload
                }),
            }
        ),

        save: new AsyncActionWithPayloadConfig<StorageState, StorageSchema['save']>(
            '[STORAGE] Save',
            {
                response: (state, { payload }) => ({
                    entries: {
                        ...state.entries,
                        ...payload
                    }
                }),
            }
        ),

        remove: new AsyncActionWithPayloadConfig<StorageState, StorageSchema['remove']>(
            '[STORAGE] Remove',
            {
                response: (state, { payload }) => ({
                    entries: Object.entries(state.entries)
                        .filter(([key]) => !payload.includes(key))
                        .reduce((entries, [key, value]) => ({ ...entries, [key]: value }), {})
                }),
            }
        ),

        clear: new AsyncActionWithoutPayloadConfig<StorageState, StorageSchema['clear']>(
            '[STORAGE] Clear',
            {
                response: () => ({
                    entries: {}
                }),
            }
        ),

    }
);
