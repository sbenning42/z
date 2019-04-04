import { Component } from '@angular/core';
import { AppStore } from './core/state/app/app.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'starter';
  constructor(
    public app: AppStore
  ) {
    this.app.dispatch(new this.app.Z.initialize.Dispatch());
  }
}
