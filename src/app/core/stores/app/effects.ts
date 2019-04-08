import { Injectable } from "@angular/core";
import { AppStore } from "./store";
import { Effect, ofType } from "@ngrx/effects";
import { mergeMap, switchMap } from "rxjs/operators";
import { Event, grabHeaders, AsyncData, Action } from "../../z-store/z-store";
import { from, concat, of } from "rxjs";
import { SYMBOLS } from "./config";
import { StorageStore } from "../storage/store";
import { AuthStore } from "../auth/store";
import { Entries } from "../storage/config";
import { Authentication } from "../auth/config";

@Injectable()
export class AppEffects {
    constructor(
        public app: AppStore,
        public storage: StorageStore,
        public auth: AuthStore,
    ) {}

    @Effect({ dispatch: true })
    initialize = this.app.actions$.pipe(
        ofType(this.app.actions.initialize.type),
        mergeMap((initialize: Event) => {
            const withInit = new AsyncData({ all: [SYMBOLS.INITIALIZE_HEADER] });
            const [init] = grabHeaders(SYMBOLS.INITIALIZE_HEADER)(initialize);
            const initialized = this.app.factories.initialized(undefined, [init]);
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
            return concat(of(get), get$, of(initialized));
        })
    );
}
