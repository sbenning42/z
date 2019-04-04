import { Component, OnInit } from '@angular/core';
import { StorageStore } from '../../../core/state/storage/storage.store';
import { AuthStore } from '../../../core/state/auth/auth.store';
import { AppStore } from '../../../core/state/app/app.store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public storage: StorageStore,
    public auth: AuthStore,
    public app: AppStore,
  ) { }

  ngOnInit() {
  }

}
