import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeModule } from './pages/home/home.module';
import { NotFoundModule } from './pages/not-found/not-found.module';
import { ComponentsModule } from './components/components.module';
import { SigninModule } from './pages/signin/signin.module';
import { SignupModule } from './pages/signup/signup.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    ComponentsModule,
    HomeModule,
    SigninModule,
    SignupModule,
    NotFoundModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
