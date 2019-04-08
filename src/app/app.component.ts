import { Component } from '@angular/core';
import { StorageStore } from './core/state/storage/storage.store';
import { AUTH_HEADER } from './core/state/auth/auth.config';
import { anchor } from './core/zto/tools/anchor';
import { test } from './core/z-store/z-store';

import { StorageStore as StorageStoreV2 } from './core/stores/storage/store';
import { SampleStore } from './core/stores/sample/store';
import { AuthStore } from './core/stores/auth/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'starter';
  constructor(
    public storage: StorageStore,
    public storageV2: StorageStoreV2,
    public sample: SampleStore,
    public auth: AuthStore,
  ) {
    /**
     * 
        const track = anchor('AppComponent@constructor');
        storage.dispatch(new storage.actions.get.Request([track]));
        auth.dispatch(new auth.actions.setCredentials.Action({
          email: 'test@test.test',
          password: 'Test42Test',
        }, [AUTH_HEADER.SAVE, track]));
     */
    // test(this.auth.stores.store$, this.auth.stores.actions$);
  }
}
