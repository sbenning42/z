import { Component } from '@angular/core';
import { StorageStore } from './core/state/storage/storage.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'starter';
  constructor(public storage: StorageStore) {
    console.log(storage.selector);
    storage.state.state.subscribe(console.log);
    storage.state.loaded.subscribe(console.log);
    console.log(storage.actions.get);
    console.log(new storage.actions.get.Request());
    console.log(new storage.actions.remove.Request(['test']));
  }
}
