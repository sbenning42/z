import { Component, OnInit } from '@angular/core';
import { Link } from '../../models/link';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header-container',
  templateUrl: './header-container.component.html',
  styleUrls: ['./header-container.component.css']
})
export class HeaderContainerComponent implements OnInit {

  links$: Observable<Link[]> = of(true ? [
    new Link('/home', 'Home', 'home'),
    new Link('/signout', 'Sign Out', ''),
  ] : [
    new Link('/home', 'Home', 'home'),
    new Link('/signin', 'Sign In', ''),
    new Link('/signup', 'Sign Up', ''),
  ]);

  constructor(
  ) { }

  ngOnInit() {
  }

  navigate(link: Link) {

  }

}
