import { Schemas, Schema, Action } from "../../z/core/types";
import { createSyncActionConfig } from "../../z/core/config-factories";

export const APP = 'APP';

export interface AppLoading {
    id: string;
    title?: string;
    message?: string;
}

export interface AppError {
    id: string;
    title?: string;
    message?: string;
    stack?: string;
}

export interface AppState {
    ready: boolean;
    loading: boolean;
    error: boolean;
    loadings: AppLoading[];
    errors: AppError[];
}

export interface AppSchema extends Schemas {
    goto: Schema<{ target: string, data?: any }>;
    initialize: Schema;
    initialized: Schema;
    startLoading: Schema<AppLoading>;
    stopLoading: Schema<string>;
    clearLoadings: Schema;
    startError: Schema<AppError>;
    stopError: Schema<string>;
    clearErrors: Schema;
}

export const initialAppState: AppState = {
    ready: false,
    loading: false,
    error: false,
    loadings: [],
    errors: [],
};

export const appActionsConfig = {
    goto: createSyncActionConfig('[APP] Go To'),
    initialize: createSyncActionConfig('[APP] Initialize', false, ['@initialize']),
    initialized: createSyncActionConfig('[APP] Initialized', false),
    startLoading: createSyncActionConfig('[APP] Start Loading'),
    stopLoading: createSyncActionConfig('[APP] Stop Loading'),
    clearLoadings: createSyncActionConfig('[APP] Clear Loading', false),
    startError: createSyncActionConfig('[APP] Start Error'),
    stopError: createSyncActionConfig('[APP] Stop Error'),
    clearErrors: createSyncActionConfig('[APP] Clear Error', false),
};

export const appReducersConfig = {
    initialized: {
        request: state => ({ ...state, ready: true })
    },
    startLoading: {
        request: (state, { payload }: Action<AppLoading>) => ({ ...state, loading: true, loadings: [payload, ...state.loadings] }),
    },
    stopLoading: {
        request: (state, { payload }: Action<string>) => ({ ...state, loading: state.loadings.length > 1, loadings: state.loadings.filter(loader => loader.id !== payload) }),
    },
    clearLoadings: {
        request: state => ({ ...state, loading: false, loadings: [] }),
    },
    startError: {
        request: (state, { payload }: Action<AppError>) => ({ ...state, error: true, errors: [payload, ...state.errors] }),
    },
    stopError: {
        request: (state, { payload }: Action<string>) => ({ ...state, error: state.errors.length > 1, loadings: state.errors.filter(err => err.id !== payload) }),
    },
    clearErrors: {
        request: state => ({ ...state, error: false, errors: [] }),
    },
};
