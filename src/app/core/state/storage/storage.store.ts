import { Injectable } from '@angular/core';
import { BaseStoreManager, StoresService } from '../../zto';
import {
  StorageState,
  StorageSchema,
  storageConfig
} from './storage.config';
import { Effect } from '@ngrx/effects';

@Injectable({
  providedIn: 'root'
})
export class StorageStore extends BaseStoreManager<StorageState, StorageSchema> {

  constructor(protected stores: StoresService) {
    super(stores, storageConfig());
  }

  @Effect({ dispatch: false })
  protected getEffect$ = this.actions$.pipe();

  @Effect({ dispatch: false })
  protected saveEffect$ = this.actions$.pipe();

  @Effect({ dispatch: false })
  protected removeEffect$ = this.actions$.pipe();

  @Effect({ dispatch: false })
  protected clearEffect$ = this.actions$.pipe();

}
