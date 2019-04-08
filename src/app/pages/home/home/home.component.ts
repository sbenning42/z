import { Component, OnInit } from '@angular/core';
import { StorageStore } from 'src/app/core/state/storage/storage.store';
import { Observable } from 'rxjs';
import { Entries } from 'src/app/core/state/storage/storage.config';
import { anchor } from 'src/app/core/zto/tools/anchor';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthStore } from 'src/app/core/stores/auth/store';
import { Credentials, User } from 'src/app/core/stores/auth/config';
import { AppStore } from 'src/app/core/stores/app/store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loaded$: Observable<boolean> = this.storage.state.loaded;
  entries$: Observable<Entries> = this.storage.state.entries;

  authentified$: Observable<boolean> = this.auth.state.authentified;
  credentials$: Observable<Credentials> = this.auth.state.credentials;
  user$: Observable<User> = this.auth.state.user;
  token$: Observable<string> = this.auth.state.token;

  authForm: FormGroup;
  emailControl: FormControl;
  passwordControl: FormControl;

  constructor(
    public storage: StorageStore,
    public auth: AuthStore,
    public app: AppStore,
  ) { }

  ngOnInit() {
    this.makeForm();
    this.initialize();
  }

  private anchor(name: string, data?: any) {
    return anchor(`HomeComponent@${name}`, data);
  }

  private makeForm() {
    this.emailControl = new FormControl('', [Validators.required]);
    this.passwordControl = new FormControl('', [Validators.required]);
    this.authForm = new FormGroup({
      emailControl: this.emailControl,
      passwordControl: this.passwordControl,
    });
  }

  initialize() {
    this.app.dispatchs.initialize(undefined);
  }

  setCredentials(credentials: Credentials) {
    this.auth.dispatchs.credentials(credentials);
  }
  removeCredentials() {
    this.auth.dispatchs.credentials(null);
  }
  register(user: Partial<User>) {
    this.auth.dispatchs.register(user);
  }
  authenticate(credentials: Credentials) {
    this.auth.dispatchs.authenticate(credentials);
  }
  revoke() {
    this.auth.dispatchs.revoke(undefined);
  }

  get() {
    const { Request } = this.storage.actions.get;
    this.storage.dispatch(new Request([this.anchor('get')]));
  }
  save(entries: Entries) {
    const { Request } = this.storage.actions.save;
    this.storage.dispatch(new Request(entries, [this.anchor('save')]));
  }
  remove(keys: string[]) {
    const { Request } = this.storage.actions.remove;
    this.storage.dispatch(new Request(keys, [this.anchor('remove')]));
  }
  clear() {
    const { Request } = this.storage.actions.clear;
    this.storage.dispatch(new Request([this.anchor('clear')]));
  }

}
