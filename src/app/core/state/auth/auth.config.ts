import { ActionsSchema, StoreConfig, ActionSchema, SyncActionWithPayloadConfig, SyncActionWithoutPayloadConfig, AsyncActionWithPayloadConfig, AsyncActionWithoutPayloadConfig } from "../../zto";
import { Credentials, User } from "../../services/auth/auth.service";

export enum AUTH_HEADER {
    SAVE = '@save-credentials-to-storage',
    REMOVE = '@remove-credentials-from-storage',
}

export interface AuthState {
    authentified: boolean;
    credentials: Credentials;
    user: User;
    token: string;
}

export interface AuthSchema extends ActionsSchema {
    setCredentials: ActionSchema<Credentials>;
    removeCredentials: ActionSchema;
    register: ActionSchema<Partial<User>, User>;
    authenticate: ActionSchema<Credentials, { user: User, token: string }>;
    revoke: ActionSchema<void, {}>;
}

export const authConfig = () => new StoreConfig<AuthState, AuthSchema>(
    'AUTH',
    {
        authentified: false,
        credentials: null,
        user: null,
        token: null,
    },
    {
        setCredentials: new SyncActionWithPayloadConfig<AuthState, AuthSchema['setCredentials']>(
            '[AUTH] Set Credentials', (state, { payload }) => ({ credentials: payload })
        ) as any,

        removeCredentials: new SyncActionWithoutPayloadConfig<AuthState, AuthSchema['removeCredentials']>(
            '[AUTH] Remove Credentials', () => ({ credentials: null })
        ) as any,

        register: new AsyncActionWithPayloadConfig<AuthState, AuthSchema['register']>(
            '[AUTH] Register', {
                response: (state, { payload }) => ({ user: payload }),
            }
        ),

        authenticate: new AsyncActionWithPayloadConfig<AuthState, AuthSchema['authenticate']>(
            '[AUTH] Authenticate', {
                response: (state, { payload: { user, token } }) => ({ authentified: true, user, token }),
            }
        ),

        revoke: new AsyncActionWithoutPayloadConfig<AuthState, AuthSchema['revoke']>(
            '[AUTH] Revoke', {
                response: () => ({ authentified: true, user: null, token: null }),
            }
        ),

    }
);
