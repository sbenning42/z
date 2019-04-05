import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoresService } from './core/stores.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
    imports: [
      CommonModule,
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      StoreRouterConnectingModule.forRoot(),
      StoreDevtoolsModule.instrument({ maxAge: 100 }),
    ],
    declarations: [],
    providers: [
        StoresService
    ]
})
export class ZtoModule { }
