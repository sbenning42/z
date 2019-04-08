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
    NOOP,
    Header
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
    START_LOADING_HEADER = '@start-loading',
    STOP_LOADING_HEADER = '@stop-loading',
    CLEAR_LOADING_HEADER = '@clear-loading',
    LOAD_ASYNC_HEADER = '@load-async',
    START_ERROR_HEADER = '@start-error',
    STOP_ERROR_HEADER = '@stop-error',
    CLEAR_ERROR_HEADER = '@clear-error',
    ERROR_ASYNC_HEADER = '@error-async',
}

export function appHeader(type: SYMBOLS) {
    return (type === SYMBOLS.START_LOADING_HEADER
        || type === SYMBOLS.LOAD_ASYNC_HEADER)
            ? (title?: string, message?: string) => ({ type, data: new AppLoading(title, message) })
            : (title?: string, message?: string, stack?: string) => ({ type, data: new AppError(title, message, stack) })
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
