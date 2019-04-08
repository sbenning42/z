import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { StorageService } from './services/storage/storage.service';
import { AuthService } from './services/auth/auth.service';
import { TodoService } from './services/todo/todo.service';
import { InMemoryDataService } from './services/in-memory-data/in-memory-data.service';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { StoresModule } from './stores/stores.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    StoresModule,
    SharedModule,
  ],
  declarations: [],
  providers: [
    StorageService,
    AuthService,
    TodoService,
  ],
  exports: [
    SharedModule
  ]
})
export class CoreModule { }
