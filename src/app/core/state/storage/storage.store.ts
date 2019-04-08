import { Injectable } from '@angular/core';
import { BaseStoreManager, StoresService } from '../../zto';
import {
  StorageState,
  StorageSchema,
  storageConfig
} from './storage.config';

@Injectable({
  providedIn: 'root'
})
export class StorageStore extends BaseStoreManager<StorageState, StorageSchema> {
  constructor(protected stores: StoresService) {
    super(stores, storageConfig());
  }
}
