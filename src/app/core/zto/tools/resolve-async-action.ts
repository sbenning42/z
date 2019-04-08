import { ActionSchema } from "../core/types/action-schema";
import { Observable, of } from "rxjs";
import { HeadersType } from "../core/types/headers-type";
import { Action } from "../core/types/action";
import { ofType } from "@ngrx/effects";
import { AsyncActionFactories } from "../core/types/async-action-factory";
import { ofHeader, ofHeaderId } from "./of";
import { ASYNC_HEADER } from "../core/symbols/headers";
import { mergeMap, withLatestFrom, takeUntil, map, catchError, take, tap } from "rxjs/operators";
import { grabHeader } from "./headers";

export type ResolverWithoutPayloadAndState<Result> = () => Observable<Result>;
export type ResolverWitPayloadWithoutState<Payload, Result> = (payload: Payload) => Observable<Result>;
export type ResolverWithStateWithoutPayload<Result, State> = (state: State) => Observable<Result>;
export type ResolverWithPayloadAndState<Payload, Result, State> = (payload: Payload, state: State) => Observable<Result>;

export type _Resolver<Payload, Result, State = void> = Payload extends void
    ? (State extends void ? ResolverWithoutPayloadAndState<Result> : ResolverWithStateWithoutPayload<Result, State>)
    : (State extends void ? ResolverWitPayloadWithoutState<Payload, Result> : ResolverWithPayloadAndState<Payload, Result, State>);

export type Resolver<ThisActionSchema extends ActionSchema<any, any>, State = void> = _Resolver<ThisActionSchema['Payload'], ThisActionSchema['Result'], State>;

export function resolveAsyncAction<ThisActionSchema extends ActionSchema<any, any>, State = void>(
    factories: AsyncActionFactories<ThisActionSchema>,
    resolver: Resolver<ThisActionSchema, State>,
    headers: {
        response?: HeadersType;
        error?: HeadersType;
    } = {},
    state$?: Observable<State>,
) {
    headers = {
        response: [...(headers.response || [])],
        error: [...(headers.error || [])],
    };
    return (actions$: Observable<Action<any>>) => actions$.pipe(
        ofType(factories.Request.type),
        ofHeader(ASYNC_HEADER),
        withLatestFrom(state$ || of({})),
        mergeMap(([request, state]: [Action<ThisActionSchema['Payload']>, State]) => {
            const async = grabHeader(ASYNC_HEADER)(request);
            let resolved$;
            if (request.payload && state) {
                resolved$ = (resolver as ResolverWithPayloadAndState<any, any, any>)(request.payload, state);
            } else if (request.payload) {
                resolved$ = (resolver as ResolverWitPayloadWithoutState<any, any>)(request.payload);
            } else if (state) {
                resolved$ = (resolver as ResolverWithStateWithoutPayload<any, any>)(state);
            } else {
                resolved$ = (resolver as ResolverWithoutPayloadAndState<any>)();
            }
            const cancel$ = actions$.pipe(
                ofType(factories.Cancel.type),
                ofHeaderId(async.id),
            );
            return resolved$.pipe(
                take(1),
                map(result => new factories.Response(result, request, headers.response)),
                catchError(error => of(new factories.Error(error, request, headers.error))),
                takeUntil(cancel$)
            );
        })
    );
}



export function resolveAsyncHeader<ThisActionSchema extends ActionSchema<any, any>, State = void>() {
    return (actions$: Observable<Action<any>>) => actions$.pipe(
    );    
}
