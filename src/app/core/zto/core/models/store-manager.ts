import { Store, select, createSelector } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { ActionsSchema } from '../types/actions-schema';
import { StateManager } from '../types/state-manager';
import { ActionsManager } from '../types/actions-manager';
import { StateReducer } from '../types/state-reducer';
import { Action } from '../types/action';
import { StoreConfig } from './store-config';
import { ActionWithPayload } from './action-with-payload';
import { HeadersType } from '../types/headers-type';
import { asHeaders } from '../../tools/as-headers';
import { ASYNC_HEADER } from '../symbols/headers';
import { Headers } from '../types/headers';
import { StateActionReducer } from '../types/state-action-reducer';
import { grabHeader } from '../../tools/headers';
import { ofHeaderId } from '../../tools/of';
import { take, takeUntil } from 'rxjs/operators';
import { merge } from 'rxjs';
import {
    asRequestType,
    asResponseType,
    asErrorType,
    asCancelType,
    baseType,
    isRequestType,
    isResponseType,
    isErrorType,
    isCancelType
} from '../../tools/as-type';

export class StoreManager<ThisState, ThisActionsSchema extends ActionsSchema> {
    
    state: StateManager<ThisState>;
    actions: ActionsManager<ThisActionsSchema>;
    selector: string;
    reducer: StateReducer<ThisState, ThisActionsSchema>;

    constructor(
        public config: StoreConfig<ThisState, ThisActionsSchema>,
        protected store$: Store<any>,
        protected actions$: Actions<Action<any>>,
    ) {
        this.setup();
    }

    private setup() {
        this.setupSelector();
        this.setupState();
        this.setupActions();
        this.setupReducer();
    }

    private setupSelector() {
        this.selector = this.config.selector;
    }

    private setupState() {
        const selectState = (states: any) => states[this.selector] as ThisState;
        this.state = {
            state: this.store$.pipe(
                select(selectState)
            ),
            ...Object.keys(this.config.initial)
                .reduce((state, key) => ({
                    ...state,
                    [key]: this.store$.pipe(
                        select(createSelector(selectState, state => state[key]))
                    ),
                }), {}),
        } as StateManager<ThisState>;
    }

    private setupActions() {
        this.actions = Object.entries(this.config.actions)
            .reduce((managers, [name, config]) => {
                const _AsyncRequestWithPayload = class AsyncRequestWithPayload extends ActionWithPayload<ThisActionsSchema[string]['Payload']> {
                    static type = asRequestType(config.type);
                    constructor(payload: ThisActionsSchema[string]['Payload'], headers: HeadersType = []) {
                        super(
                            asRequestType(config.type),
                            payload,
                            asHeaders(headers.concat(ASYNC_HEADER, ...config.staticHeaders['request']))
                        );
                    }
                }
                const _AsyncRequestWithoutPayload = class AsyncRequestWithoutPayload extends ActionWithPayload<undefined> {
                    static type = asRequestType(config.type);
                    constructor(headers: HeadersType = []) {
                        super(
                            asRequestType(config.type),
                            undefined,
                            asHeaders(headers.concat(ASYNC_HEADER, ...config.staticHeaders['request']))
                        );
                    }
                }
                return {
                    ...managers,
                    [name]: config.isAsync
                        ? {
                            type: config.type,
                            Request: config.hasPayload ? _AsyncRequestWithPayload : _AsyncRequestWithoutPayload,
                            Response: class extends ActionWithPayload<ThisActionsSchema[string]['Result']> {
                                static type = asResponseType(config.type);
                                constructor(payload: ThisActionsSchema[string]['Result'], public request: Action<ThisActionsSchema[string]['Payload']>, headers: HeadersType = []) {
                                    super(
                                        asResponseType(config.type),
                                        payload,
                                        asHeaders(headers.concat(...request.headers.filter(header => header.followAsync), ...config.staticHeaders['response']))
                                    );
                                }
                            },
                            Error: class extends ActionWithPayload<Error> {
                                static type = asErrorType(config.type);
                                constructor(payload: Error, public request: Action<ThisActionsSchema[string]['Payload']>, headers: HeadersType = []) {
                                    super(
                                        asErrorType(config.type),
                                        payload,
                                        asHeaders(headers.concat(...request.headers.filter(header => header.followAsync), ...config.staticHeaders['error']))
                                    );
                                }
                            },
                            Cancel: class extends ActionWithPayload<undefined> {
                                static type = asCancelType(config.type);
                                constructor(public request: Action<ThisActionsSchema[string]['Payload']>, headers: HeadersType = []) {
                                    super(
                                        asCancelType(config.type),
                                        undefined,
                                        asHeaders(headers.concat(...request.headers.filter(header => header.followAsync), ...config.staticHeaders['cancel']))
                                    );
                                }
                            },
                        }
                        : {
                            type: config.type,
                            Action: config.hasPayload
                                ? class extends ActionWithPayload<ThisActionsSchema[string]['Payload']> {
                                    static type = config.type;
                                    constructor(payload: ThisActionsSchema[string]['Payload'], headers: HeadersType = []) {
                                        super(
                                            config.type,
                                            payload,
                                            asHeaders(headers.concat(...config.staticHeaders as Headers))
                                        );
                                    }
                                }
                                : class extends ActionWithPayload<undefined> {
                                    static type = config.type;
                                    constructor(headers: HeadersType = []) {
                                        super(
                                            config.type,
                                            undefined,
                                            asHeaders(headers.concat(...config.staticHeaders as Headers))
                                        );
                                    }
                                }
                        }
                };
            }, {}) as ActionsManager<ThisActionsSchema>;
    }

    private setupReducer() {
        this.reducer = (state = this.config.initial, action) => {
            const { type } = action;
            const [, config] = Object.entries(this.config.actions).find(([, thisConfig]) => thisConfig.type === baseType(type)) || [undefined, undefined];
            const [, manager] = Object.entries(this.actions).find(([, thisManager]) => thisManager.type === baseType(type)) || [undefined, undefined];
            if (!config || !manager) {
                return state;
            }
            if (config.isAsync) {
                if (isRequestType(type)) {
                    const reducer = config.reducer['request'] as StateActionReducer<ThisState, ThisActionsSchema[string]['Payload']>;
                    const newState = reducer ? reducer(state, action) : state;
                    return newState === state ? state : { ...(state as any), ...(newState as any) };
                } else if (isResponseType(type)) {
                    const reducer = config.reducer['response'] as StateActionReducer<ThisState, ThisActionsSchema[string]['Result']>;
                    const newState = reducer ? reducer(state, action) : state;
                    return newState === state ? state : { ...(state as any), ...(newState as any) };
                } else if (isErrorType(type)) {
                    const reducer = config.reducer['error'] as StateActionReducer<ThisState, Error>;
                    const newState = reducer ? reducer(state, action) : state;
                    return newState === state ? state : { ...(state as any), ...(newState as any) };
                } else if (isCancelType(type)) {
                    const reducer = config.reducer['cancel'] as StateActionReducer<ThisState, undefined>;
                    const newState = reducer ? reducer(state, action) : state;
                    return newState === state ? state : { ...(state as any), ...(newState as any) };
                }
            } else {
                const reducer = config.reducer as StateActionReducer<ThisState, ThisActionsSchema[string]['Payload']>;
                const newState = reducer ? reducer(state, action) : state;
                return newState === state ? state : { ...(state as any), ...(newState as any) };
            }
            return state;
        };
    }

    dispatch(request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) {
        this.store$.dispatch(request);
        return request;
    }

    onRequest(request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>, headerType: string = ASYNC_HEADER) {
        const type = baseType(request.type);
        const async = grabHeader(headerType)(request);
        const others$ = this.actions$.pipe(
            ofHeaderId(async.id),
            ofType(
                asResponseType(type),
                asErrorType(type),
                asCancelType(type),
            ),
            take(1),
        );
        return this.actions$.pipe(
            ofHeaderId(async.id),
            ofType(asRequestType(type)),
            take(1),
            takeUntil(others$)
        );
    }

    onFinish(request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>, headerType: string = ASYNC_HEADER) {
        return merge(
            this.onResponse(request, headerType),
            this.onError(request, headerType),
            this.onCancel(request, headerType),
        ).pipe(take(1));
    }

    onResponse(request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>, headerType: string = ASYNC_HEADER) {
        const type = baseType(request.type);
        const async = grabHeader(headerType)(request);
        const others$ = this.actions$.pipe(
            ofHeaderId(async.id),
            ofType(
                asErrorType(type),
                asCancelType(type),
            ),
            take(1),
        );
        return this.actions$.pipe(
            ofHeaderId(async.id),
            ofType(asResponseType(type)),
            take(1),
            takeUntil(others$)
        );
    }

    onError(request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>, headerType: string = ASYNC_HEADER) {
        const type = baseType(request.type);
        const async = grabHeader(headerType)(request);
        const others$ = this.actions$.pipe(
            ofHeaderId(async.id),
            ofType(
                asResponseType(type),
                asCancelType(type),
            ),
            take(1),
        );
        return this.actions$.pipe(
            ofHeaderId(async.id),
            ofType(asErrorType(type)),
            take(1),
            takeUntil(others$)
        );
    }

    onCancel(request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>, headerType: string = ASYNC_HEADER) {
        const type = baseType(request.type);
        const async = grabHeader(headerType)(request);
        const others$ = this.actions$.pipe(
            ofHeaderId(async.id),
            ofType(
                asResponseType(type),
                asErrorType(type),
            ),
            take(1),
        );
        return this.actions$.pipe(
            ofHeaderId(async.id),
            ofType(asCancelType(type)),
            take(1),
            takeUntil(others$)
        );
    }
}
