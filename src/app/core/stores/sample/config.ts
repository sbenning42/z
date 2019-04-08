import {
    ZStoreConfig,
    ZSchema,
    ZSelectors,
    documentFactory,
    eventFactory,
    commandFactory,
    ZDocument,
    ZEvent,
    ZCommand
} from "../../z-store/z-store";

export const type = 'SAMPLE';

export interface State {
    bool: boolean;
    str: string;
}

export interface Schema extends ZSchema {
    bool: ZDocument<boolean>;
    boolTrue: ZEvent;
    boolFalse: ZEvent;
    str: ZDocument<string>;
    asyncStr: ZCommand<string, string>;
}

export interface Selectors extends ZSelectors<State> {
}

export const initial: State = {
    bool: false,
    str: null,
};

export function config() {
    return new ZStoreConfig<State, Schema, Selectors>(
        type,
        initial,
        {
            bool: documentFactory('[SAMPLE] BOOL', (state, bool) => ({ bool })),
            boolTrue: eventFactory('[SAMPLE] BOOL TRUE', () => ({ bool: true })),
            boolFalse: eventFactory('[SAMPLE] BOOL FALSE', () => ({ bool: false })),
            str: documentFactory('[SAMPLE] STR', (state, str) => ({ str })),
            asyncStr: commandFactory('[SAMPLE] ASYNC STR', { onSuccess: (state, str) => ({ str }) }),
        }
    );
}
