import { Injectable } from "@angular/core";
import { AuthStore } from "./store";
import { Effect, ofType } from "@ngrx/effects";
import { mergeMap, map, catchError, takeUntil } from "rxjs/operators";
import { Action, grabHeaders, SYMBOLS, onCancel, async } from "../../z-store/z-store";
import { of, timer, Observable } from "rxjs";
import { User, Credentials, Authentication } from "./config";
import { AuthService } from "../../services/auth/auth.service";

@Injectable()
export class AuthEffects {
    constructor(
        public store: AuthStore,
        public auth: AuthService
    ) {}

    @Effect({ dispatch: true })
    register = this.store.actions$.pipe(
        async<Partial<User>, User>(
            this.store.actions.register,
            user => this.auth.register(user)
        ),
    );

    @Effect({ dispatch: true })
    authenticate = this.store.actions$.pipe(
        async<Credentials, Authentication>(
            this.store.actions.authenticate,
            credentrials => this.auth.authenticate(credentrials)
        ),
    );

    @Effect({ dispatch: true })
    revoke = this.store.actions$.pipe(
        async<void, {}, string>(
            this.store.actions.revoke,
            token => this.auth.revoke(token),
            this.store.state.token,
            {},
        ),
    );

}
