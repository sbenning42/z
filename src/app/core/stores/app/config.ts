import {
    uuid,
    ZStoreConfig,
    ZSchema,
    ZSelectors,
    documentFactory,
    eventFactory,
    commandFactory,
    ZDocument,
    ZEvent,
    ZCommand,
    NOOP
} from "../../z-store/z-store";

export const type = 'APP';

export class AppLoading {
    id = uuid();
    constructor(
        public title: string,
        public message?: string,
    ) {}
}

export class AppError {
    id = uuid();
    constructor(
        public title: string,
        public message: string,
        public stack?: string,
    ) {}
    
}

export enum SYMBOLS {
    INITIALIZE_HEADER = '@initialize',
}

export interface State {
    ready: boolean;
    loading: boolean;
    error: boolean;
    loadings: AppLoading[];
    errors: AppError[];
}

export interface Schema extends ZSchema {
    initialize: ZEvent;
    initialized: ZEvent;
    startLoading: ZEvent<AppLoading>;
    startError: ZEvent<AppError>;
    stopLoading: ZEvent<string>;
    stopError: ZEvent<string>;
    clearLoadings: ZEvent;
    clearErrors: ZEvent;
}

export interface Selectors extends ZSelectors<State> {
}

export const initial: State = {
    ready: false,
    loading: false,
    error: false,
    loadings: [],
    errors: [],
};

export function config() {
    return new ZStoreConfig<State, Schema, Selectors>(
        type,
        initial,
        {
            initialize: eventFactory('[APP] INITIALIZE', NOOP, [SYMBOLS.INITIALIZE_HEADER]),

            initialized: eventFactory('[APP] INITIALIZED', () => ({ ready: true })),
            
            startLoading: eventFactory('[APP] START LOADING', (state, loading) => ({
                loading: true,
                loadings: [loading, ...state.loadings]
            })),
            
            startError: eventFactory('[APP] START ERROR', (state, error) => ({
                error: true,
                errors: [error, ...state.errors]
            })),
            
            stopLoading: eventFactory('[APP] STOP LOADING', (state, id) => ({
                loading: state.loadings.length > 1,
                loadings: state.loadings.filter(loading => loading.id !== id),
            })),
            
            stopError: eventFactory('[APP] STOP ERROR', (state, id) => ({
                error: state.errors.length > 1,
                errors: state.errors.filter(error => error.id !== id),
            })),
            
            clearLoadings: eventFactory('[APP] CLEAR LOADINGS', () => ({ loading: false, loadings: [] })),
            
            clearErrors: eventFactory('[APP] CLEAR ERRORS', () => ({ error: false, errors: [] })),
        
        }
    );
}
