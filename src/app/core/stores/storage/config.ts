import { ZStoreConfig, ZSchema, ZSelectors, ZCommand, commandFactory } from "../../z-store/z-store";
import { appHeader, SYMBOLS } from "../app/config";

export const type = 'STORAGE';

export interface Entries {
    [x: string]: any;
}

export interface State {
    loaded: boolean;
    entries: Entries;
}

export interface Schema extends ZSchema {
    get: ZCommand<void, Entries>;
    save: ZCommand<Entries, Entries>;
    remove: ZCommand<string[], string[]>;
    clear: ZCommand<void, undefined>;
}

export interface Selectors extends ZSelectors<State> {
}

export const initial: State = {
    loaded: false,
    entries: null,
};

export function config() {
    return new ZStoreConfig<State, Schema, Selectors>(
        type,
        initial,
        {

            get: commandFactory(
                '[STORAGE] GET',
                {
                    onSuccess: (state, entries) => ({ loaded: true, entries })
                },
                {
                    request: [appHeader(SYMBOLS.LOAD_ASYNC_HEADER)('Getting Storage ...')],
                    failure: [appHeader(SYMBOLS.ERROR_ASYNC_HEADER)('Getting Storage Failed ...')]
                }
            ),

            save: commandFactory(
                '[STORAGE] SAVE',
                {
                    onSuccess: (state, entries) => ({ entries: { ...state.entries, ...entries } })
                },
                {
                    request: [appHeader(SYMBOLS.LOAD_ASYNC_HEADER)('Saving Storage ...')],
                    failure: [appHeader(SYMBOLS.ERROR_ASYNC_HEADER)('Saving Storage Failed ...')]
                }
            ),

            remove: commandFactory(
                '[STORAGE] REMOVE',
                {
                    onSuccess: (state, keys) => ({
                        entries: Object.entries(state.entries)
                            .filter(([key]) => !keys.includes(key))
                            .reduce((entries, [name, value]) => ({ ...entries, [name]: value }), {})
                    }),
                },
                {
                    request: [appHeader(SYMBOLS.LOAD_ASYNC_HEADER)('Removing Storage ...')],
                    failure: [appHeader(SYMBOLS.ERROR_ASYNC_HEADER)('Removing Storage Failed ...')]
                }
            ),

            clear: commandFactory(
                '[STORAGE] CLEAR',
                {
                    onSuccess: () => ({ entries: {} })
                },
                {
                    request: [appHeader(SYMBOLS.LOAD_ASYNC_HEADER)('Clearing Storage ...')],
                    failure: [appHeader(SYMBOLS.ERROR_ASYNC_HEADER)('Clearing Storage Failed ...')]
                }
            ),

        }
    );
}
