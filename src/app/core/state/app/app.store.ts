import { Injectable } from '@angular/core';
import { BaseZ } from '../../z/core/base-z';
import { AppState, AppSchema, APP, initialAppState, appActionsConfig, appReducersConfig, AppLoading, AppError } from './app.config';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '../../z/core/types';
import { mergeMap, map, switchMap, tap, withLatestFrom, distinctUntilKeyChanged, skip, concatMap, bufferCount, filter } from 'rxjs/operators';
import { StorageStore } from '../storage/storage.store';
import { concat, of, from } from 'rxjs';
import { Entries } from '../storage/storage.config';
import { grabHeader, Header } from '../../z/core/models';
import { WithHeaderOfType, withHeader, withHeaderIds } from '../../z/custom-rxjs-operators/filters';
import { AuthStore } from '../auth/auth.store';
import { Router } from '@angular/router';
import { isARequestType, ASYNC_HEADER, isAnErrorType } from '../../z/core/symbols';
import { MatDialog } from '@angular/material/dialog';
import { LoadingContainerComponent } from '../../../components/loading-container/loading-container.component';
import { ErrorContainerComponent } from '../../../components/error-container/error-container.component';

@Injectable({
  providedIn: 'root'
})
export class AppStore extends BaseZ<AppState, AppSchema> {

  constructor(
    public store: Store<any>,
    public actions$: Actions<Action<any>>,
    public auth: AuthStore,
    public storage: StorageStore,
    public router: Router,
    public dialog: MatDialog
  ) {
    super(store, actions$, APP, initialAppState, appActionsConfig, appReducersConfig);
  }

  @Effect({ dispatch: true })
  protected loadAsyncEffect$ = this.actions$.pipe(
    withHeader(ASYNC_HEADER),
    withHeader('@load'),
    filter(action => isARequestType(action.type)),
    mergeMap(request => {
      const load = grabHeader('@load')(request);
      const async = grabHeader(ASYNC_HEADER)(request);
      return concat(
        of(new this.Z.startLoading.Dispatch({
          id: async.id,
          title: load.data ? load.data.title : '',
          message: load.data ? load.data.message : '',
        }, [load])),
        this.actions$.pipe(
          withHeaderIds(async.id),
          concatMap(response => isAnErrorType(response.type)
            ? [new this.Z.stopLoading.Dispatch(async.id, [load]), new this.Z.startError.Dispatch({
              id: async.id,
              title: (response as Action<AppError>).payload.title,
              message: (response as Action<AppError>).payload.message,
            }, [load])]
            : [new this.Z.stopLoading.Dispatch(async.id, [load])]
          )
        )
      );
    })
  );

  @Effect({ dispatch: false })
  protected uiLoadingEffect$ = this.Z.loading.pipe(
    withLatestFrom(this.Z.loadings),
    distinctUntilKeyChanged('0'),
    skip(1),
    concatMap(([loading, loadings]) => {
      let ref;
      if (loading) {
        ref = this.openDialog(LoadingContainerComponent, loadings[0]);
      }
      return loading ? of([loading, loadings, ref]) : of([]);
    }),
    bufferCount(2),
    tap(([[, , ref]]) => {
      ref.close();
    })
  );

  @Effect({ dispatch: false })
  protected uiErrorEffect$ = this.Z.error.pipe(
    withLatestFrom(this.Z.errors),
    distinctUntilKeyChanged('0'),
    skip(1),
    concatMap(([error, errors]) => {
      let ref;
      if (error) {
        console.log('Start error for: ', errors);
        ref = this.openDialog(ErrorContainerComponent, errors[0], false);
      }
      return error ? of([error, errors, ref]) : of(undefined);
    }),
    bufferCount(2),
    tap(([[, , ref]]) => {
      ref.close();
    })
  );

  @Effect({ dispatch: true })
  protected initializeEffect$ = this.actions$.pipe(
    WithHeaderOfType('@initialize')(this.Z.initialize.Dispatch.type),
    mergeMap((initialize: Action<void>) => {
      const header = grabHeader('@initialize')(initialize);
      const get = new this.storage.Z.get.Request([header]);
      const loadStart = new this.Z.startLoading.Dispatch({ id: header.id }, [header]);
      const loadStop = new this.Z.stopLoading.Dispatch(header.id, [header]);
      const initialized = new this.Z.initialized.Dispatch([header]);
      return concat(
        from([loadStart, get]),
        this.storage.Z.get.Request.onFinish(get).pipe(
          switchMap((response: Action<Entries>) => {
            if (!response.payload.credentials) {
              return from([initialized, loadStop]);
            } else {
              const authenticate = new this.auth.Z.authenticate.Request(response.payload.credentials, [header]);
              return concat(
                of(authenticate),
                this.auth.Z.authenticate.Request.onFinish(authenticate).pipe(concatMap(() => [initialized, loadStop]))
              );
            }
          })
        )
      );
    })
  );

  @Effect({ dispatch: false })
  protected gotoEffect$ = this.actions$.pipe(
    ofType(this.Z.goto.Dispatch.type),
    tap(({ payload }: Action<string | { target: string, data: any }>) => {
      if (typeof(payload) === 'string') {
        this.router.navigate([payload]);
      } else {
        this.router.navigate([payload.target], { queryParams: payload.data });
      }
    })
  );

  private openDialog(component: any, data: AppLoading | AppError, disableClose: boolean = true) {
    const dialogRef = this.dialog.open(component, { data, disableClose });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

    return dialogRef;
  }
}
