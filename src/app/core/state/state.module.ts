import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageStore } from './storage/storage.store';
import { EffectsModule } from '@ngrx/effects';
import { StorageEffects } from './storage/storage.effects';
import { AuthStore } from './auth/auth.store';
import { AuthEffects } from './auth/auth.effects';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forRoot([
      StorageEffects,
    ]),
  ],
  declarations: [],
  providers: [
    StorageStore,
    StorageEffects,
  ]
})
export class StateModule { }
