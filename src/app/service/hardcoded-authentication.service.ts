import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HardcodedAuthenticationService {
  logedIn$ = new Subject<boolean>();

  constructor() {}

  authenticate(username: string, password: string) {
    if (username === 'VuNguyen' && password === '123') {
      sessionStorage.setItem('authenticateUser', username);
      this.logedIn$.next(true);
      return true;
    }

    this.logedIn$.next(false);
    return false;
  }

  isUserLoggedIn() {
    const user = sessionStorage.getItem('authenticateUser');
    this.logedIn$.next(!!user);
    return !(user == null);
  }

  logout() {
    sessionStorage.removeItem('authenticateUser');
    this.logedIn$.next(false);
  }
}
