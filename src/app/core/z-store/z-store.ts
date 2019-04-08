import * as _uuid from 'uuid/v4';
import { Observable, merge, of } from 'rxjs';
import { Store, select, createSelector } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { filter, take, takeUntil, mergeMap, withLatestFrom, map, catchError } from 'rxjs/operators';

export const uuid = () => _uuid() as string;

export class Header<D = any> {
    id = uuid();
    type: string;
    constructor(
        header: HeaderLike,
        public data?: D,
    ) {
        if (typeof(header) === 'string') {
            this.type = header;
        } else {
            this.type = header.type;
            this.id = header.id !== undefined ? header.id : this.id;
            this.data = header.data !== undefined ? header.data : this.data;
        }
    }
}

export type Headers = Array<Header>;

export type HeaderLike = string | Partial<Header>;

export type HeaderLikes = Array<HeaderLike>;

export class Action<P = any> {
    id = uuid();
    headers: Headers;
    constructor(
        public type: string,
        public payload: P,
        headers: HeaderLikes = []
    ) {
        this.headers = headers.map(header => new Header(header));
    }
}

export const grabHeaders = <D>(...types: string[]) => (action: Action) => action.headers
    && action.headers
        .filter(header => types.includes(header.type)) as Array<Header<D>>;
export const grabHeaderIds = <D>(...ids: string[]) => (action: Action) => action.headers
    && action.headers
        .filter(header => ids.includes(header.id)) as Array<Header<D>>;

export class Document<D = any> extends Action<D> {}
export class Event<P = any> extends Action<P> {}
export class CommandRequest<P = any> extends Action<P> {}
export class CommandCancel extends Action<undefined> {}
export class CommandSuccess<R = any> extends Action<R> {}
export class CommandFailure extends Action<Error> {}

export enum SYMBOLS {
    DOCUMENT = 'DOCUMENT',
    EVENT = 'EVENT',
    COMMAND = 'COMMAND',
    ASYNC_HEADER = '@async',
    ASYNC = ' -- ASYNC @ ',
    REQUEST = 'REQUEST',
    CANCEL = 'CANCEL',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export type DocumentReducer<State, D> = (state: State, document: D) => Partial<State>;

export type EventReducer<State, P> = (state: State, payload: P) => Partial<State>;

export type CommandReducer<State, P, R> = {
    onRequest?: (state: State, payload: P) => Partial<State>;
    onCancel?: (state: State) => Partial<State>;
    onSuccess?: (state: State, result: R) => Partial<State>;
    onFailure?: (state: State, error: Error) => Partial<State>;
};

export class DocumentClass<State, D = any> {
    _type: SYMBOLS.DOCUMENT = SYMBOLS.DOCUMENT;
    _payload: D;
    _result: void;
    constructor(
        public type: string,
        public Update: new (document: D, headers?: HeaderLikes) => Document<D>,
        public reducer: DocumentReducer<State, D>,
    ) {}
}

export class EventClass<State, P = any> {
    _type: SYMBOLS.EVENT = SYMBOLS.EVENT;
    _payload: P;
    _result: void;
    constructor(
        public type: string,
        public Fire: new (payload: P, headers?: HeaderLikes) => Event<P>,
        public reducer: EventReducer<State, P>,
    ) {}    
}

export const typeAs = (...appends: string[]) => (type: string) => type + appends.reduce((all, chunk) => all + chunk);

export const typeAsAsyncRequest = typeAs(SYMBOLS.ASYNC, SYMBOLS.REQUEST);
export const typeAsAsyncCancel = typeAs(SYMBOLS.ASYNC, SYMBOLS.CANCEL);
export const typeAsAsyncSuccess = typeAs(SYMBOLS.ASYNC, SYMBOLS.SUCCESS);
export const typeAsAsyncFailure = typeAs(SYMBOLS.ASYNC, SYMBOLS.FAILURE);

export class CommandClass<State, P = any, R = any> {
    _type: SYMBOLS.COMMAND = SYMBOLS.COMMAND;
    _payload: P;
    _result: R;
    requestType: string = typeAsAsyncRequest(this.type);
    cancelType: string = typeAsAsyncCancel(this.type);
    successType: string = typeAsAsyncSuccess(this.type);
    failureType: string = typeAsAsyncFailure(this.type);
    constructor(
        public type: string,
        public Request: new (payload: P, headers?: HeaderLikes, thisAsyncData?: AsyncData) => CommandRequest<P>,
        public Cancel: new (request: CommandRequest<P>, headers?: HeaderLikes) => CommandCancel,
        public Success: new (result: R, request: CommandRequest<P>, headers?: HeaderLikes) => CommandSuccess<R>,
        public Failure: new (error: Error, request: CommandRequest<P>, headers?: HeaderLikes) => CommandFailure,
        public reducer: CommandReducer<State, P, R>,
    ) {}
}

export const NOOP = () => ({});

export function documentFactory<State, D>(type: string, reducer: DocumentReducer<State, D> = NOOP, headers: HeaderLikes = []) {
    class DocumentFactory extends Document<D> {
        constructor(document: D, thisHeaders: HeaderLikes = []) {
            super(type, document, headers.concat(...thisHeaders));
        }
    }
    return new DocumentClass(type, DocumentFactory, reducer);
}

export function eventFactory<State, P>(type: string, reducer: EventReducer<State, P> = NOOP, headers: HeaderLikes = []) {
    class EventFactory extends Event<P> {
        constructor(payload: P, thisHeaders: HeaderLikes = []) {
            super(type, payload, headers.concat(...thisHeaders));
        }
    }
    return new EventClass(type, EventFactory, reducer);
}

export class AsyncData {
    constructor(
        public fromRequest: {
            all?: string[];
            cancel?: string[];
            success?: string[];
            failure?: string[];
        } = {}
    ) {
        this.fromRequest = {
            all: [...(fromRequest.all || [])],
            cancel: [...(fromRequest.cancel || [])],
            success: [...(fromRequest.success || [])],
            failure: [...(fromRequest.failure || [])],
        };
    }
}

export function commandFactory<State, P, R>(
    type: string,
    reducer: CommandReducer<State, P, R> = {},
    headers: {
        request?: HeaderLikes,
        response?: HeaderLikes,
        cancel?: HeaderLikes,
        success?: HeaderLikes,
        failure?: HeaderLikes,
    } = {},
    asyncData: AsyncData = new AsyncData()
) {
    headers = {
        request: [...(headers.request || [])],
        response: [...(headers.response || [])],
        cancel: [...(headers.cancel || [])],
        success: [...(headers.success || [])],
        failure: [...(headers.failure || [])],
    };
    class CommandRequestFactory extends CommandRequest<P> {
        constructor(payload: P, thisHeaders: HeaderLikes = [], thisAsyncData?: AsyncData) {
            const async = new Header(SYMBOLS.ASYNC_HEADER, thisAsyncData || asyncData);
            super(typeAsAsyncRequest(type), payload, headers.request.concat(...thisHeaders, async));
        }
    }
    class CommandCancelFactory extends CommandCancel {
        request: CommandRequest<P>;
        constructor(request: CommandRequest<P>, thisHeaders: HeaderLikes = []) {
            const [async] = grabHeaders<AsyncData>(SYMBOLS.ASYNC_HEADER)(request);
            const fromRequests = grabHeaders(
                ...async.data.fromRequest.all,
                ...async.data.fromRequest.cancel,
            )(request);
            super(typeAsAsyncCancel(type), undefined, headers.cancel.concat(
                ...headers.response,
                ...thisHeaders,
                ...fromRequests,
                async
            ));
            this.request = request;
        }
    }
    class CommandSuccessFactory extends CommandSuccess<R> {
        request: CommandRequest<P>;
        constructor(result: R, request: CommandRequest<P>, thisHeaders: HeaderLikes = []) {
            const [async] = grabHeaders<AsyncData>(SYMBOLS.ASYNC_HEADER)(request);
            const fromRequests = grabHeaders(
                ...async.data.fromRequest.all,
                ...async.data.fromRequest.success
            )(request);
            super(typeAsAsyncSuccess(type), result, headers.success.concat(
                ...headers.response,
                ...thisHeaders,
                ...fromRequests,
                async
            ));
            this.request = request;
        }
    }
    class CommandFailureFactory extends CommandFailure {
        request: CommandRequest<P>;
        constructor(error: Error, request: CommandRequest<P>, thisHeaders: HeaderLikes = []) {
            const [async] = grabHeaders<AsyncData>(SYMBOLS.ASYNC_HEADER)(request);
            const fromRequests = grabHeaders(
                ...async.data.fromRequest.all,
                ...async.data.fromRequest.failure
            )(request);
            super(typeAsAsyncFailure(type), error, headers.failure.concat(
                ...headers.response,
                ...thisHeaders,
                ...fromRequests,
                async
            ));
            this.request = request;
        }
    }
    return new CommandClass(
        type,
        CommandRequestFactory, 
        CommandCancelFactory,
        CommandSuccessFactory,
        CommandFailureFactory,
        reducer
    );
}

export type _ZAction<State, T extends SYMBOLS = SYMBOLS.EVENT, P = void, R = void> = T extends SYMBOLS.DOCUMENT
    ? DocumentClass<State, P>
    : (
        T extends SYMBOLS.EVENT
            ? EventClass<State, P>
            : (
                T extends SYMBOLS.COMMAND
                    ? CommandClass<State, P, R>
                    : undefined
            )
    );


export type ZAction<T extends SYMBOLS = SYMBOLS.EVENT, P = void, R = void> = T extends SYMBOLS.DOCUMENT
    ? DocumentClass<any, P>
    : (
        T extends SYMBOLS.EVENT
            ? EventClass<any, P>
            : (
                T extends SYMBOLS.COMMAND
                    ? CommandClass<any, P, R>
                    : undefined
            )
    );


export interface _ZSchema<State = any> {
    [x: string]: _ZAction<State, SYMBOLS, any | void | undefined, any | void | undefined>;
}

export interface ZSchema {
    [x: string]: ZAction<SYMBOLS, any | void | undefined, any | void | undefined>;
}

export type _Schema<State, Schema extends ZSchema> = {
    [Key in keyof Schema]: _ZAction<State, Schema[Key]["_type"], Schema[Key]['_payload'], Schema[Key]['_result']>;
}

export class Selector<State, R = any> {
    constructor(
        public selector: (state: State) => R,
    ) {}
};

export type ZSelectors<State> = {
    [x: string]: Selector<State, any>;
}; 

export type StateSelectors<State, Selectors extends ZSelectors<State> = ZSelectors<State>> = {
    [Key in keyof State]: Observable<State[Key]>;
} & {
    root: Observable<State>;
} & {
    [Key in keyof Selectors]: Observable<ReturnType<Selectors[Key]['selector']>>;
};

export class ZStoreConfig<State, Schema extends ZSchema, Selectors extends ZSelectors<State> = ZSelectors<State>> {
    constructor(    
        public type: string,
        public initial: State,
        public actions: _Schema<State, Schema>,
        public selectors?: Selectors,
    ) {
        this.selectors = this.selectors === undefined ? {} as Selectors : this.selectors;
    }
}

export type ZDispatch<Schema extends ZSchema> = {
    [Key in keyof Schema]: (payload: Schema[Key]['_payload'], headers?: HeaderLikes) => void;
}

export type ZFactories<Schema extends ZSchema> = {
    [Key in keyof Schema]: (payload: Schema[Key]['_payload'], headers?: HeaderLikes) => Action<Schema[Key]['_payload']>;
}

export class ZStore<State = {}, Schema extends ZSchema = {}, Selectors extends ZSelectors<State> = ZSelectors<State>> {
    state: StateSelectors<State, Selectors>;
    type: string;
    initial: State;
    actions: _Schema<State, Schema>;
    dispatchs: ZDispatch<Schema>;
    factories: ZFactories<Schema>;
    constructor(
        public store$: Store<any>,
        public actions$: Actions,
        config: ZStoreConfig<State, Schema, Selectors>,
    ) {
        ({ type: this.type, initial: this.initial, actions: this.actions } = config);
        const selectState = (states: any) => states[config.type] as State;
        this.state = Object.entries(config.initial).reduce((selectors, [name]) => ({
            ...selectors,
            [name]: store$.pipe(select(createSelector(selectState, state => state[name]))),
        }), {
            root: store$.pipe(select(selectState)),
            ...Object.entries(config.selectors).reduce((
                selectors: { [x: string]: Selector<State, any> },
                [name, selector]: [string, Selector<State, any>]
            ) => ({
                ...selectors,
                [name]: store$.pipe(select(createSelector(selectState, selector.selector))),
            }), {})
        }) as StateSelectors<State, Selectors>;
        this.dispatchs = Object.entries(config.actions).reduce((dispatch, [name]) => ({
            ...dispatch,
            [name]: (payload: Schema[string]['_payload'], headers?: HeaderLikes) => {
                const action = this.actions[name];
                switch (action._type) {
                    case SYMBOLS.DOCUMENT:
                        const document = action as DocumentClass<State, Schema[string]['_payload']>;
                        store$.dispatch(new document.Update(payload, headers));
                        break;
                    case SYMBOLS.EVENT:
                        const event = action as EventClass<State, Schema[string]['_payload']>;
                        store$.dispatch(new event.Fire(payload, headers));
                        break;
                    case SYMBOLS.COMMAND:
                        const command = action as CommandClass<State, Schema[string]['_payload'], Schema[string]['_result']>;
                        store$.dispatch(new command.Request(payload, headers));
                        break;
                    default:
                        return;
                }
            },
        }), {}) as ZDispatch<Schema>;
        this.factories = Object.entries(config.actions).reduce((dispatch, [name]) => ({
            ...dispatch,
            [name]: (payload: Schema[string]['_payload'], headers?: HeaderLikes) => {
                const action = this.actions[name];
                switch (action._type) {
                    case SYMBOLS.DOCUMENT:
                        const document = action as DocumentClass<State, Schema[string]['_payload']>;
                        return new document.Update(payload, headers);
                    case SYMBOLS.EVENT:
                        const event = action as EventClass<State, Schema[string]['_payload']>;
                        return new event.Fire(payload, headers);
                    case SYMBOLS.COMMAND:
                        const command = action as CommandClass<State, Schema[string]['_payload'], Schema[string]['_result']>;
                        return new command.Request(payload, headers);
                    default:
                        return;
                }
            },
        }), {}) as ZFactories<Schema>;
        store$.addReducer(config.type, (state: State = config.initial, action: Action<Schema[string]['_payload']>) => {
            const baseType = action.type.split(SYMBOLS.ASYNC)[0];
            const [name, thisAction] = Object.entries(this.actions).find(([name, thisAction]) => baseType === thisAction.type)
                || [undefined, undefined];
            if (!thisAction) {
                return state;
            }
            switch (thisAction._type) {
                case SYMBOLS.DOCUMENT: {
                    const reducer = thisAction.reducer as DocumentReducer<State, Schema[string]['_payload']>;
                    return { ...state as any, ...reducer(state, action.payload) as any };
                }
                case SYMBOLS.EVENT: {
                    const reducer = thisAction.reducer as EventReducer<State, Schema[string]['_payload']>;
                    return { ...state as any, ...reducer(state, action.payload) as any };
                }
                case SYMBOLS.COMMAND: {
                    const command = thisAction as CommandClass<State, Schema[string]['_payload'], Schema[string]['_result']>;
                    switch (action.type) {
                        case command.requestType:
                            return command.reducer.onRequest
                                ? { ...state as any, ...command.reducer.onRequest(state, action.payload) as any }
                                : state;
                        case command.cancelType:
                            return command.reducer.onCancel
                                ? { ...state as any, ...command.reducer.onCancel(state) as any }
                                : state;
                        case command.successType:
                            return command.reducer.onSuccess
                                ? { ...state as any, ...command.reducer.onSuccess(state, action.payload) as any }
                                : state;
                        case command.failureType:
                            return command.reducer.onFailure
                                ? { ...state as any, ...command.reducer.onFailure(state, action.payload) as any }
                                : state;
                        default:
                            return state;
                    }
                }
                default:
                    return state;
            }
        });
    }
    dispatch(action: Action) {
        this.store$.dispatch(action);
    }
    cancel(request: CommandRequest, headers?: HeaderLike[]) {
        const action = Object.values(this.actions)
            .filter(action => action._type === SYMBOLS.COMMAND)
            .find(action => (action as CommandClass<State>).requestType === request.type);
        if (!action) {
            return;
        }
        const command = action as CommandClass<State>;
        this.dispatch(new command.Cancel(request, headers));
    }
    onRequest(request: CommandRequest) {
        return this.actions$.pipe(onRequest(request));
    }
    onFinish(request: CommandRequest) {
        return this.actions$.pipe(onFinish(request));        
    }
    onCancel(request: CommandRequest) {
        return this.actions$.pipe(onCancel(request));        
    }
    onSuccess(request: CommandRequest) {
        return this.actions$.pipe(onSuccess(request));        
    }
    onFailure(request: CommandRequest) {
        return this.actions$.pipe(onFailure(request));        
    }
}

export type ZDocument<D = void> = ZAction<SYMBOLS.DOCUMENT, D>;
export type ZEvent<P = void> = ZAction<SYMBOLS.EVENT, P>;
export type ZCommand<P = void, R = undefined> = ZAction<SYMBOLS.COMMAND, P, R>;

export function onRequest(request: CommandRequest) {
    const [async] = grabHeaders(SYMBOLS.ASYNC_HEADER)(request);
    const type = request.type;
    return (actions$: Observable<Action>) => actions$.pipe(
        filter(action => action.type === type && !!grabHeaderIds(async.id)(action)),
        take(1),
    );
}
export function onFinish(request: CommandRequest) {
    const [async] = grabHeaders(SYMBOLS.ASYNC_HEADER)(request);
    const type = request.type;
    return (actions$: Observable<Action>) => actions$.pipe(
        filter(action => action.type !== type && !!grabHeaderIds(async.id)(action)),
        take(1),
    );
}
export function onCancel(request: CommandRequest) {
    const [async] = grabHeaders(SYMBOLS.ASYNC_HEADER)(request);
    const type = request.type.split(SYMBOLS.ASYNC)[0];
    const others = (actions$: Observable<Action>) => merge(
        actions$.pipe(
            filter(action => action.type === typeAsAsyncSuccess(type) && !!grabHeaderIds(async.id)(action)),
        ),
        actions$.pipe(
            filter(action => action.type === typeAsAsyncFailure(type) && !!grabHeaderIds(async.id)(action)),
        ),
    );
    return (actions$: Observable<Action>) => actions$.pipe(
        filter(action => action.type === typeAsAsyncCancel(type) && !!grabHeaderIds(async.id)(action)),
        take(1),
        takeUntil(others(actions$))
    );
}
export function onSuccess(request: CommandRequest) {
    const [async] = grabHeaders(SYMBOLS.ASYNC_HEADER)(request);
    const type = request.type.split(SYMBOLS.ASYNC)[0];
    const others = (actions$: Observable<Action>) => merge(
        actions$.pipe(
            filter(action => action.type === typeAsAsyncCancel(type) && !!grabHeaderIds(async.id)(action)),
        ),
        actions$.pipe(
            filter(action => action.type === typeAsAsyncFailure(type) && !!grabHeaderIds(async.id)(action)),
        ),
    );
    return (actions$: Observable<Action>) => actions$.pipe(
        filter(action => action.type === type && !!grabHeaderIds(async.id)(action)),
        take(1),
        takeUntil(others(actions$))
    );
}
export function onFailure(request: CommandRequest) {
    const [async] = grabHeaders(SYMBOLS.ASYNC_HEADER)(request);
    const type = request.type.split(SYMBOLS.ASYNC)[0];
    const others = (actions$: Observable<Action>) => merge(
        actions$.pipe(
            filter(action => action.type === typeAsAsyncSuccess(type) && !!grabHeaderIds(async.id)(action)),
        ),
        actions$.pipe(
            filter(action => action.type === typeAsAsyncCancel(type) && !!grabHeaderIds(async.id)(action)),
        ),
    );
    return (actions$: Observable<Action>) => actions$.pipe(
        filter(action => action.type === type && !!grabHeaderIds(async.id)(action)),
        take(1),
        takeUntil(others(actions$))
    );
}

export type Resolver<P, R, S> = P extends void
    ? (
        S extends void
            ? (() => Observable<R>)
            : ((state: S) => Observable<R>)
    ) : (
        S extends void
            ? ((payload: P) => Observable<R>)
            : ((payload: P, state: S) => Observable<R>)
    );

export function switchResolver<P, R, S>(
    _resolver: Resolver<P, R, S>,
    payload: P,
    state: S
) {
    if (typeof(payload) !== 'undefined' && typeof(state) !== 'undefined') {
        const resolver = _resolver as (payload: P, state: S) => Observable<R>;
        return resolver(payload, state);
    } else if (typeof(payload) !== 'undefined') {
        const resolver = _resolver as (payload: P) => Observable<R>;
        return resolver(payload);
    } else if (typeof(state) !== 'undefined') {
        const resolver = _resolver as (state: S) => Observable<R>;
        return resolver(state);
    } else {
        const resolver = _resolver as () => Observable<R>;
        return resolver();
    }
}

export function async<P, R, S = undefined>(
    command: ZCommand<P, R>,
    resolver: Resolver<P, R, S>,
    state$?: Observable<S>,
    headers: {
        success?: HeaderLikes;
        failure?: HeaderLikes;
    } = {},
) {
    return (actions$: Observable<Action>) => actions$.pipe(
        ofType(command.requestType),
        withLatestFrom(state$ || of(undefined)),
        mergeMap(([request, state]: [CommandRequest, S]) => {
            const cancel$ = actions$.pipe(onCancel(request));
            return switchResolver<P, R, S>(resolver, request.payload, state).pipe(
                take(1),
                map(result => new command.Success(result, request, headers.success)),
                catchError(error => of(new command.Failure(error, request, headers.failure))),
                takeUntil(cancel$),
            );
        })
    );
}

// Plain Object this ZStore should manipulate
interface TestState {
    test: string;
}

// Typing for "Action"s you can do on this Store (State / Plain Object described earlier)
interface TestSchema extends ZSchema {
    test: ZDocument<string>;
    asyncTest: ZCommand<string, string>;
    tested: ZEvent;
}

type TestSelectors = {
    testLength: Selector<TestState, number>;
};

export function test(store$: Store<any>, actions$: Actions) {
    const z = new ZStore<TestState, TestSchema, TestSelectors>(store$, actions$, {
        type: 'TEST',
        initial: {
            test: null
        },
        actions: {
            test: documentFactory('[TEST] Test', (state, test) => ({ test })),
            asyncTest: commandFactory('[TEST] Async Test', {
                onSuccess: (state, test) => ({})
            }),
            tested: eventFactory('[TEST] Tested', NOOP),
        },
        selectors: {
            testLength: new Selector(state => state && state.test && state.test.length)
        },
    });
    console.log(z);
    z.factories.test('');
    z.factories.asyncTest('');
    z.factories.tested(undefined);
    z.state.testLength.subscribe(length => console.log(`Length is ${length} !`));
    new z.actions.test.Update('');
    new z.actions.tested.Fire(undefined);
    const r = new z.actions.asyncTest.Request('this is a test', ['@load']);
    const s = new z.actions.asyncTest.Success('test was tested', r, []);
    const c = new z.actions.asyncTest.Cancel(r, []);
    console.log(r, s, c);
    const from = new Header<{ from: string }>('@from', { from: 'function test() { ... }' });
    z.dispatchs.test('this is a sync test', [from]);
    z.dispatchs.tested(undefined, [from]);
    const request = new z.actions.asyncTest.Request('this is an async test', [from]);
    store$.dispatch(request);
    store$.dispatch(new z.actions.asyncTest.Success('async test was tested', request));
}
