import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../core/shared/shared.module';
import { HeaderContainerComponent } from './header-container/header-container.component';
import { HeaderPresenterComponent } from './header-container/header-presenter/header-presenter.component';
import { LoadingContainerComponent } from './loading-container/loading-container.component';
import { LoadingPresenterComponent } from './loading-container/loading-presenter/loading-presenter.component';
import { ErrorContainerComponent } from './error-container/error-container.component';
import { ErrorPresenterComponent } from './error-container/error-presenter/error-presenter.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    HeaderContainerComponent,
    HeaderPresenterComponent,
    LoadingContainerComponent,
    LoadingPresenterComponent,
    ErrorContainerComponent,
    ErrorPresenterComponent,
  ],
  entryComponents: [
    LoadingContainerComponent,
    ErrorContainerComponent,
  ],
  exports: [
    HeaderContainerComponent,
    LoadingContainerComponent,
    ErrorContainerComponent,
  ]
})
export class ComponentsModule { }
