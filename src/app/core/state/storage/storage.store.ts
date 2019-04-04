import { Injectable } from '@angular/core';
import { BaseZ } from '../../z/core/base-z';
import { StorageState, StorageSchema, STORAGE, initialStorageState, storageActionsConfig, storageReducersConfig } from './storage.config';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '../../z/core/types';
import { StorageService } from '../../services/storage/storage.service';
import { basicAsyncHeaderResolver } from '../../z/custom-rxjs-operators/resolve-async-header';

@Injectable({
  providedIn: 'root'
})
export class StorageStore extends BaseZ<StorageState, StorageSchema> {

  constructor(
    public store: Store<any>,
    public actions$: Actions<Action<any>>,
    public storage: StorageService,
  ) {
    super(store, actions$, STORAGE, initialStorageState, storageActionsConfig, storageReducersConfig);
  }

  @Effect({ dispatch: true })
  protected getEffect$ = this.actions$.pipe(basicAsyncHeaderResolver(this.Z.get, () => this.storage.get()));

  @Effect({ dispatch: true })
  protected saveEffect$ = this.actions$.pipe(basicAsyncHeaderResolver(this.Z.save, entries => this.storage.save(entries)));

  @Effect({ dispatch: true })
  protected removeEffect$ = this.actions$.pipe(basicAsyncHeaderResolver(this.Z.remove, keys => this.storage.remove(keys)));

  @Effect({ dispatch: true })
  protected clearEffect$ = this.actions$.pipe(basicAsyncHeaderResolver(this.Z.clear, () => this.storage.clear()));

}
