import { Injectable } from '@angular/core';
import { BaseZ } from '../../z/core/base-z';
import { AuthState, AuthSchema, AUTH, initialAuthState, authActionsConfig, authReducersConfig } from './auth.config';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '../../z/core/types';
import { AuthService } from '../../services/auth/auth.service';
import { basicAsyncHeaderResolver } from '../../z/custom-rxjs-operators/resolve-async-header';

@Injectable({
  providedIn: 'root'
})
export class AuthStore extends BaseZ<AuthState, AuthSchema> {

  constructor(
    public store: Store<any>,
    public actions$: Actions<Action<any>>,
    public auth: AuthService,
  ) {
    super(store, actions$, AUTH, initialAuthState, authActionsConfig, authReducersConfig);
  }

  @Effect({ dispatch: true })
  protected registerEffect$ = this.actions$.pipe(
    basicAsyncHeaderResolver(this.Z.register, user => this.auth.register(user))
  );

  @Effect({ dispatch: true })
  protected authenticateEffect$ = this.actions$.pipe(
    basicAsyncHeaderResolver(this.Z.authenticate, credentials => this.auth.authenticate(credentials))
  );

  @Effect({ dispatch: true })
  protected revokeEffect$ = this.actions$.pipe(
    basicAsyncHeaderResolver(this.Z.revoke, token => this.auth.revoke(token), this.Z.token)
  );
}
