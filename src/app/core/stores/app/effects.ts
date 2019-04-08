import { Injectable } from "@angular/core";
import { AppStore } from "./store";
import { Effect, ofType } from "@ngrx/effects";
import { mergeMap, switchMap, filter, map, withLatestFrom, distinctUntilKeyChanged, skip, concatMap, bufferCount } from "rxjs/operators";
import { Event, grabHeaders, AsyncData, Action, hasHeaders, SYMBOLS } from "../../z-store/z-store";
import { from, concat, of, timer } from "rxjs";
import { SYMBOLS as APPSYMBOLS, AppLoading, AppError } from "./config";
import { StorageStore } from "../storage/store";
import { AuthStore } from "../auth/store";
import { Entries } from "../storage/config";
import { Authentication } from "../auth/config";
import { ErrorContainerComponent } from "src/app/components/error-container/error-container.component";
import { LoadingContainerComponent } from "src/app/components/loading-container/loading-container.component";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";

@Injectable()
export class AppEffects {
    constructor(
        public app: AppStore,
        public storage: StorageStore,
        public auth: AuthStore,
        public dialog: MatDialog
    ) {}

    @Effect({ dispatch: true })
    initialize = this.app.actions$.pipe(
        ofType(this.app.actions.initialize.type),
        mergeMap((initialize: Event) => {
            const withInit = new AsyncData({ all: [APPSYMBOLS.INITIALIZE_HEADER] });
            const [init] = grabHeaders(APPSYMBOLS.INITIALIZE_HEADER)(initialize);
            const loading = new AppLoading('App  Initialize ...');
            const initialized = this.app.factories.initialized(undefined, [init]);
            const startLoading = this.app.factories.startLoading(loading, [init]);
            const stopLoading = this.app.factories.stopLoading(loading.id, [init]);
            const get = new this.storage.actions.get.Request(undefined, [init], withInit);
            const switchGet = ({ payload }: Action<Entries>) => {
                if (payload.firstVisit === false && payload.credentials) {
                    const authenticate = new this.auth.actions.authenticate.Request(payload.credentials, [init], withInit);
                    const switchAuthenticate = (authenticateResult: Action<Authentication>) => {
                        return from([]);
                    };
                    const authenticate$ = this.auth.onFinish(authenticate).pipe(switchMap(switchAuthenticate));
                    return concat(of(authenticate), authenticate$);
                } else {
                    return from([]);
                }
            };
            const get$ = this.storage.onFinish(get).pipe(switchMap(switchGet));
            return concat(from([startLoading, get]), get$, from([initialized, stopLoading]));
        })
    );

    @Effect({ dispatch: true })
    startLoading = this.app.actions$.pipe(
        filter(hasHeaders(APPSYMBOLS.START_LOADING_HEADER)),
        map(action => {
            const [start] = grabHeaders<AppLoading>(APPSYMBOLS.START_LOADING_HEADER)(action);
            return this.app.factories.startLoading(start.data);
        })
    );
    @Effect({ dispatch: true })
    stopLoading = this.app.actions$.pipe(
        filter(hasHeaders(APPSYMBOLS.STOP_LOADING_HEADER)),
        map(action => {
            const [stop] = grabHeaders<string>(APPSYMBOLS.STOP_LOADING_HEADER)(action);
            return this.app.factories.stopLoading(stop.data);
        }),
    );
    @Effect({ dispatch: true })
    clearLoading = this.app.actions$.pipe(
        filter(hasHeaders(APPSYMBOLS.CLEAR_LOADING_HEADER)),
        map(() => this.app.factories.clearLoadings(undefined)),
    );
    

    @Effect({ dispatch: true })
    startError = this.app.actions$.pipe(
        filter(hasHeaders(APPSYMBOLS.START_LOADING_HEADER)),
        map(action => {
            const [start] = grabHeaders<AppLoading>(APPSYMBOLS.START_LOADING_HEADER)(action);
            return this.app.factories.startLoading(start.data);
        })
    );
    @Effect({ dispatch: true })
    stopError = this.app.actions$.pipe(
        filter(hasHeaders(APPSYMBOLS.STOP_LOADING_HEADER)),
        map(action => {
            const [stop] = grabHeaders<string>(APPSYMBOLS.STOP_LOADING_HEADER)(action);
            return this.app.factories.stopLoading(stop.data);
        }),
    );
    @Effect({ dispatch: true })
    clearError = this.app.actions$.pipe(
        filter(hasHeaders(APPSYMBOLS.CLEAR_ERROR_HEADER)),
        map(() => this.app.factories.clearErrors(undefined)),
    );

    @Effect({ dispatch: true })
    loadAsync = this.app.actions$.pipe(
        filter(hasHeaders(SYMBOLS.ASYNC_HEADER)),
        filter(hasHeaders(APPSYMBOLS.LOAD_ASYNC_HEADER)),
        mergeMap((action: Action) => {
            const [load] = grabHeaders<AppLoading>(APPSYMBOLS.LOAD_ASYNC_HEADER)(action);
            const finish$ = this.app.onFinish(action);
            const startLoading = this.app.factories.startLoading(load.data);
            const stopLoading = this.app.factories.stopLoading(load.data.id);
            return concat(of(startLoading), finish$.pipe(map(() => stopLoading)));
        })
    );

    @Effect({ dispatch: true })
    errorAsync = this.app.actions$.pipe(
        filter(hasHeaders(SYMBOLS.ASYNC_HEADER)),
        filter(hasHeaders(APPSYMBOLS.ERROR_ASYNC_HEADER)),
        filter((action: Action) => action.type.includes(SYMBOLS.ASYNC) && action.type.includes(SYMBOLS.FAILURE)),
        mergeMap((action: Action) => {
            const [error] = grabHeaders<AppError>(APPSYMBOLS.ERROR_ASYNC_HEADER)(action);
            const startError = this.app.factories.startError(error.data);
            return of(startError);
        })
    );

    @Effect({ dispatch: true })
    uiLoading = this.app.state.loading.pipe(
        withLatestFrom(this.app.state.loadings),
        distinctUntilKeyChanged('0'),
        skip(1),
        concatMap<[boolean, AppLoading[]], MatDialogRef<any>>(([loading, loadings]) => {
            if (loading) {
                return timer(0).pipe(
                    switchMap(() => of(this.dialog.open(LoadingContainerComponent, { data: loadings })))
                );
            }
            return of(undefined);
        }),
        bufferCount(2),
        map(([ref]) => {
            ref.close();
            return this.app.factories.clearLoadings(undefined);
        })
    );

    @Effect({ dispatch: true })
    uiError = this.app.state.error.pipe(
        withLatestFrom(this.app.state.errors),
        distinctUntilKeyChanged('0'),
        skip(1),
        concatMap<[boolean, AppError[]], MatDialogRef<any>>(([error, errors]) => {
            if (error) {
                return timer(0).pipe(switchMap(() => {
                    const ref = this.dialog.open(ErrorContainerComponent, { data: errors });
                    ref.afterClosed().subscribe(() => this.app.dispatchs.clearErrors(undefined));
                    return of(ref);
                }));
            }
            return of(undefined);
        }),
        bufferCount(2),
        map(([ref]) => {
            ref.close();
            return this.app.factories.clearErrors(undefined);
        })
    );
}
