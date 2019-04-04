import { Component, OnInit } from '@angular/core';
import { Link } from '../../models/link';
import { AppStore } from '../../core/state/app/app.store';
import { AuthStore } from '../../core/state/auth/auth.store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header-container',
  templateUrl: './header-container.component.html',
  styleUrls: ['./header-container.component.css']
})
export class HeaderContainerComponent implements OnInit {

  links$: Observable<Link[]> = this.auth.Z.authentified.pipe(map(authentified => authentified ? [
    new Link('/home', 'Home', 'home'),
    new Link('/signout', 'Sign Out', ''),
  ] : [
    new Link('/home', 'Home', 'home'),
    new Link('/signin', 'Sign In', ''),
    new Link('/signup', 'Sign Up', ''),
  ]));

  constructor(
    public app: AppStore,
    public auth: AuthStore,
  ) { }

  ngOnInit() {
  }

  navigate(link: Link) {
    if (link.path === '/signout') {
      this.auth.dispatch(new this.auth.Z.revoke.Request());
      this.app.dispatch(new this.app.Z.goto.Dispatch({ target: '/home' }));
    } else {
      this.app.dispatch(new this.app.Z.goto.Dispatch({ target: link.path }));
    }
  }

}
