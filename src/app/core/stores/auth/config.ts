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

export const type = 'AUTH';

export interface Credentials {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    password?: string;
}

export interface Authentication {
    user: User;
    token: string;
}

export interface State {
    authentified: boolean;
    credentials: Credentials;
    user: User;
    token: string;
}

export interface Schema extends ZSchema {
    credentials: ZDocument<Credentials>;
    user: ZDocument<User>;
    token: ZDocument<string>;
    register: ZCommand<Partial<User>, User>;
    authenticate: ZCommand<Credentials, Authentication>;
    revoke: ZCommand<void, {}>;
}

export interface Selectors extends ZSelectors<State> {
}

export const initial: State = {
    authentified: false,
    credentials: null,
    user: null,
    token: null,
};

export function config() {
    return new ZStoreConfig<State, Schema, Selectors>(
        type,
        initial,
        {
            
            credentials: documentFactory('[AUTH] CREDENTIALS', (state, credentials) => ({ credentials })),
            
            user: documentFactory('[AUTH] USER', (state, user) => ({ user })),
            
            token: documentFactory('[AUTH] TOKEN', (state, token) => ({ token })),
            
            register: commandFactory('[AUTH] REGISTER', {
                onSuccess: (state, user) => ({ user }),
            }),
            
            authenticate: commandFactory('[AUTH] AUTHENTICATE', {
                onSuccess: (state, { user, token }) => ({ authentified: true, user, token }),
            }),
            
            revoke: commandFactory('[AUTH] REVOKE', {
                onSuccess: () => ({ authentified: false, user: null, token: null }),
            }),
        
        }
    );
}
