import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { AuthStore } from "./auth.store";
import { AuthService, Credentials } from "../../services/auth/auth.service";
import { StorageStore } from "../storage/storage.store";
import { ofHeader, Action, grabHeader } from "../../zto";
import { AUTH_HEADER } from "./auth.config";
import { map } from "rxjs/operators";

@Injectable()
export class AuthEffects {
    constructor(
        public actions$: Actions,
        public authStore: AuthStore,
        public storageStore: StorageStore,
        public authService: AuthService,
    ) {}

    @Effect({ dispatch: true })
    protected saveCredentialsEffect$ = this.actions$.pipe(
        ofType(this.authStore.actions.setCredentials.Action.type),
        ofHeader(AUTH_HEADER.SAVE),
        map((action: Action<Credentials>) => {
            const save = grabHeader(AUTH_HEADER.SAVE)(action);
            const credentials = action.payload;
            const { Request } = this.storageStore.actions.save;
            return new Request({ credentials }, [save]);
        }),
    );

    @Effect({ dispatch: true })
    protected removeCredentialsEffect$ = this.actions$.pipe(
        ofType(this.authStore.actions.removeCredentials.Action.type),
        ofHeader(AUTH_HEADER.REMOVE),
        map((action: Action<undefined>) => {
            const remove = grabHeader(AUTH_HEADER.REMOVE)(action);
            const { Request } = this.storageStore.actions.remove;
            return new Request(['credentials'], [remove]);
        }),
    );

    @Effect({ dispatch: false })
    protected registerEffect$ = this.actions$.pipe();
    @Effect({ dispatch: false })
    protected authenticateEffect$ = this.actions$.pipe();
    @Effect({ dispatch: false })
    protected revokeEffect$ = this.actions$.pipe();
}
