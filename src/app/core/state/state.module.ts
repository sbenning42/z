import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StorageStore } from './storage/storage.store';
import { AuthStore } from './auth/auth.store';
import { AppStore } from './app/app.store';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([
      StorageStore,
      AuthStore,
      AppStore
    ]),
    StoreDevtoolsModule.instrument({ maxAge: 100 })
  ],
  declarations: [],
  providers: [
    StorageStore,
    AuthStore,
    AppStore,
  ]
})
export class StateModule { }
