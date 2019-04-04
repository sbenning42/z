import { Schemas, Schema, Action } from '../../z/core/types';
import { createAsyncActionConfig, createSyncActionConfig } from '../../z/core/config-factories';
import { Credentials, User } from '../../services/auth/auth.service';

export const AUTH = 'AUTH';

export interface AuthState {
    authentified: boolean;
    credentials: Credentials;
    user: User;
    token: string;
}

export interface AuthSchema extends Schemas {
    setCredentials: Schema<Credentials>;
    removeCredentials: Schema;
    register: Schema<Partial<User>, User>;
    authenticate: Schema<Credentials, { user: User, token: string }>;
    revoke: Schema<void, {}>;
}

export const initialAuthState: AuthState = {
    authentified: false,
    credentials: null,
    user: null,
    token: null,
};

export const authActionsConfig = {
    setCredentials: createSyncActionConfig('[AUTH] Set Credentials'),
    removeCredentials: createSyncActionConfig('[AUTH] Remove Credentials', false),
    register: createAsyncActionConfig('[AUTH] Register'),
    authenticate: createAsyncActionConfig('[AUTH] Authenticate', true, [{ type: '@load', followAsync: false }]),
    revoke: createAsyncActionConfig('[AUTH] Revoke', false),
};

export const authReducersConfig = {
    setCredentials: { request: (state: AuthState, { payload }: Action<Credentials>) => ({ ...state, credentials: payload }) },
    removeCredentials: { request: (state: AuthState) => ({ ...state, credentials: null }) },
    register: { response: (state: AuthState, { payload }: Action<User>) => ({ ...state, user: payload }) },
    authenticate: { response: (state: AuthState, { payload }: Action<{ user: User, token: string }>) => ({ ...state, authentified: true, user: payload.user, token: payload.token }) },
    revoke: { response: (state: AuthState, { payload }: Action<User>) => ({ ...state, authentified: false, user: null, token: null }) },
};
