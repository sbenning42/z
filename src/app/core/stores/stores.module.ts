import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StorageStore } from './storage/store';
import { StorageEffects } from './storage/effects';
import { SampleStore } from './sample/store';
import { SampleEffects } from './sample/effects';
import { AuthEffects } from './auth/effects';
import { AuthStore } from './auth/store';
import { AppEffects } from './app/effects';
import { AppStore } from './app/store';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([
        SampleEffects,
        StorageEffects,
        AuthEffects,
        AppEffects
    ]),
  ],
  declarations: [],
  providers: [
    SampleStore,
    SampleEffects,
    StorageStore,
    StorageEffects,
    AuthStore,
    AuthEffects,
    AppStore,
    AppEffects
  ]
})
export class StoresModule { }
