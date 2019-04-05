import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StorageStore } from './storage/storage.store';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([
      StorageStore,
    ]),
  ],
  declarations: [],
  providers: [
    StorageStore,
  ]
})
export class StateModule { }
