import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions } from "@ngrx/effects";
import { HeadersType } from "../core/types";
import { Observable } from "rxjs";
import { Headers } from "../core/models";

export class ActionWithPayload<Payload> {
    constructor(
        public type: string,
        public payload: Payload,
        public headers: Headers = [],
    ) {}
}

export type Action<Payload = void> = Payload extends void ? ActionWithPayload<undefined> : ActionWithPayload<Payload>;

export class ActionConfig<ThisState, ThisActionSchema extends ActionSchema<any, any>> {
    constructor(
        public type: string,
        public reducer: ThisActionSchema['IsAsync'] extends false
            ? StateActionReducer<ThisState, ThisActionSchema['Payload']>
            : {
                request?: StateActionReducer<ThisState, ThisActionSchema['Payload']>,
                response?: StateActionReducer<ThisState, ThisActionSchema['Result']>,
                error?: StateActionReducer<ThisState, Error>,
                cancel?: StateActionReducer<ThisState, undefined>,
            },
        public staticHeaders: ThisActionSchema['IsAsync'] extends false
            ? HeadersType
            : {
                request?: HeadersType,
                response?: HeadersType,
                error?: HeadersType,
                cancel?: HeadersType,
            } = [] as any,
        public hasPayload: ThisActionSchema['HasPayload'] = false,
        public isAsync: ThisActionSchema['IsAsync'] = false,
    ) {}
}

export type ActionsConfig<ThisState, ThisActionsSchema extends ActionsSchema> = {
    [Key in keyof ThisActionsSchema]: ActionConfig<ThisState, ThisActionsSchema[Key]>;
};

export class StoreConfig<ThisState, ThisActionsSchema extends ActionsSchema> {
    constructor(
        public selector: string,
        public initial: ThisState,
        public actions: ActionsConfig<ThisState, ThisActionsSchema>,
    ) {}
}

export type ActionSchema<
    Payload = void,
    Result = void,
    HasPayload extends boolean = Payload extends void ? false : true,
    IsAsync extends boolean = Result extends void ? false : true,
> = {
    Payload: Payload,
    Result: Result,
    HasPayload: HasPayload,
    IsAsync: IsAsync,
};

export type ActionsSchema = {
    [x: string]: ActionSchema<any, any>;
}

export type StateActionReducer<ThisState, Payload> = (state: ThisState, action: Action<Payload>) => ThisState;

export type StateReducer<ThisState, ThisActionsSchema extends ActionsSchema> = (
    state: ThisState,
    action: Action<
        ThisActionsSchema[keyof ThisActionsSchema]['Payload']
        | ThisActionsSchema[keyof ThisActionsSchema]['Result']>,
) => ThisState;

export type StateManager<ThisState> = {
    state: Observable<ThisState>
} & {
    [Key in keyof ThisState]: Observable<ThisState[Key]>;
};

export type SyncActionWithPayloadFactory<Payload> = new (payload: Payload, headers?: Headers) => Action<Payload>;
export type SyncActionWithoutPayloadFactory = new (headers?: Headers) => Action<undefined>;
export type AsyncRequestWithPayloadFactory<Payload> = new (payload: Payload, headers?: Headers) => Action<Payload>;
export type AsyncRequestWithoutPayloadFactory = new (headers?: Headers) => Action<undefined>;
export type AsyncResponseFactory<Payload, Result> = new (payload: Result, request: Action<Payload>, headers?: Headers) => Action<Result>;
export type AsyncErrorFactory<Payload> = new (payload: Error, request: Action<Payload>, headers?: Headers) => Action<Error>;
export type AsyncCancelFactory<Payload> = new (request: Action<Payload>, headers?: Headers) => Action<undefined>;

export interface Typed {
    type: string;
}

export type SyncActionWithPayloadManager<Payload> = SyncActionWithPayloadFactory<Payload> & Typed;
export type SyncActionWithoutPayloadManager = SyncActionWithoutPayloadFactory & Typed;
export type AsyncRequestWithPayloadManager<Payload> = AsyncRequestWithPayloadFactory<Payload> & Typed;
export type AsyncRequestWithoutPayloadManager = AsyncRequestWithoutPayloadFactory & Typed;
export type AsyncResponseManager<Payload, Result> = AsyncResponseFactory<Payload, Result> & Typed;
export type AsyncErrorManager<Payload> = AsyncErrorFactory<Payload> & Typed;
export type AsyncCancelManager<Payload> = AsyncCancelFactory<Payload> & Typed;

export type ActionsDispatcher<ThisActionsSchema extends ActionsSchema> = {
    dispatch: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>;
    onFinish: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<ThisActionsSchema[keyof ThisActionsSchema]['Result'] | undefined>;
    onRequest: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>;
    onResponse: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<ThisActionsSchema[keyof ThisActionsSchema]['Result']>;
    onError: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<Error>;
    onCancel: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<undefined>;
} & Typed;

export type SyncActionFactory<ThisActionSchema extends ActionSchema<any, any>> = {
    Action: ThisActionSchema['HasPayload'] extends false
        ? SyncActionWithoutPayloadManager
        : SyncActionWithPayloadManager<ThisActionSchema['Payload']>
} & Typed;

export type AsyncActionFactories<ThisActionSchema extends ActionSchema<any, any>> = {
    Request: ThisActionSchema['HasPayload'] extends false
        ? AsyncRequestWithoutPayloadManager
        : AsyncRequestWithPayloadManager<ThisActionSchema['Payload']>;
    Response: AsyncResponseManager<ThisActionSchema['Payload'], ThisActionSchema['Result']>;
    Error: AsyncErrorManager<ThisActionSchema['Payload']>;
    Cancel: AsyncCancelManager<ThisActionSchema['Payload']>;
} & Typed;

export type ActionManager<ThisActionSchema extends ActionSchema<any, any>> = ThisActionSchema['IsAsync'] extends false
    ? SyncActionFactory<ThisActionSchema>
    : AsyncActionFactories<ThisActionSchema>;

export type ActionsManager<ThisActionsSchema extends ActionsSchema> = {
    [Key in keyof ThisActionsSchema]: ActionManager<ThisActionsSchema[Key]>;
} & ActionsDispatcher<ThisActionsSchema>;

export class StoreManager<ThisState, ThisActionsSchema extends ActionsSchema> {
    state: StateManager<ThisState>;
    actions: ActionsManager<ThisActionsSchema>;
    selector: string;
    reducer: StateReducer<ThisState, ThisActionsSchema>;
    dispatch: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>;
    onFinish: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<ThisActionsSchema[keyof ThisActionsSchema]['Result'] | undefined>;
    onRequest: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>;
    onResponse: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<ThisActionsSchema[keyof ThisActionsSchema]['Result']>;
    onError: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<Error>;
    onCancel: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<undefined>;
    constructor(
        public config: StoreConfig<ThisState, ThisActionsSchema>,
        protected store$: Store<any>,
        protected actions$: Actions<Action<any>>,
    ) {}
}

@Injectable()
export class StoresService {
    constructor(
        public store$: Store<any>,
        public actions$: Actions<Action<any>>,
    ) {}

    registerStore<ThisState, ThisActionsSchema extends ActionsSchema>(config: StoreConfig<ThisState, ThisActionsSchema>) {
        const storeManager = new StoreManager(config, this.store$, this.actions$);
        this.store$.addReducer(storeManager.selector, storeManager.reducer);
        return storeManager;
    }
}

function test() {
    const stores = new StoresService(null, null);

    const testStore = stores.registerStore(new StoreConfig<
        {
            bool: boolean;
            str: string;
        },
        {
            syncSetBoolTrue: ActionSchema;
            syncSetBoolFalse: ActionSchema;
            syncSetStr: ActionSchema<string>;
            asyncSetBoolTrue: ActionSchema<void, boolean>;
            asyncSetBoolFalse: ActionSchema<void, boolean>;
            asyncSetStr: ActionSchema<string, string>;
        }
    >(
        'TEST',
        {
            bool: false,
            str: null,
        },
        {
            
            syncSetBoolTrue: new ActionConfig(
                '[TEST] Sync Set Bool True',
                state => ({ ...state, bool: true }),
                [
                ]
            ),
            
            syncSetBoolFalse: new ActionConfig(
                '[TEST] Sync Set Bool False',
                state => ({ ...state, bool: false }),
                [
                ]
            ),
            
            syncSetStr: new ActionConfig(
                '[TEST] Sync Set Str',
                (state, { payload }) => ({ ...state, str: payload }),
                [
                ]
            ),
            
            asyncSetBoolTrue: new ActionConfig(
                '[TEST] Async Set Bool True',
                {
                    response: state => ({ ...state, bool: true }),
                },
                {
                }
            ),
            
            asyncSetBoolFalse: new ActionConfig(
                '[TEST] Async Set Bool False',
                {
                    response: state => ({ ...state, bool: false }),
                },
                {
                }
            ),
            
            asyncSetStr: new ActionConfig(
                '[TEST] Async Set Str',
                {
                    response: (state, { payload }) => ({ ...state, str: payload }),
                },
                {
                }
            ),

        }
    ));

    const { Action } = testStore.actions.syncSetBoolTrue;
    const { Request } = testStore.actions.asyncSetStr;
    testStore.dispatch(new Action());
    testStore.dispatch(new Request(''));
}