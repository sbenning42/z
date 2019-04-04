import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { uuid } from '../../z/core/tools';

export interface Credentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokens: string[] = [];

  webService = `http://localhost:4200/api/users`;

  constructor(private http: HttpClient) { }

  register(user: Partial<User>) {
    return this.http.post<User>(this.webService, user);
  }

  authenticate(credentials: Credentials) {
    console.log('Authentify: ', credentials);
    return this.http.get<User[]>(this.webService).pipe(
      switchMap(users => {
        const user = users.find(thisUser => thisUser.email === credentials.email && thisUser.password === credentials.password);
        if (!user) {
          return throwError(new Error('Wrong credentials'));
        }
        const token = uuid();
        this.tokens.push(token);
        return of({ user, token });
      })
    );
  }

  revoke(token: string) {
    console.log('Revoking: ', token);
    this.tokens = this.tokens.filter(thisToken => thisToken !== token);
    return of({});
  }

}
