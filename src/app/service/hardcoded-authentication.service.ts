import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { ApiService, LoginRes } from '../services/api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HardcodedAuthenticationService {
  loggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private api: ApiService, private router: Router) {}

  async authenticate(username: string, password: string) {
    const loginRes = await firstValueFrom(
      this.api.login({ username, password })
    );

    if (loginRes.valid) {
      sessionStorage.setItem('authenticateUser', username);
      this.loggedIn$.next(true);
      return true;
    }

    this.loggedIn$.next(false);
    return false;
  }

  isUserLoggedIn() {
    const user = sessionStorage.getItem('authenticateUser');
    this.loggedIn$.next(!!user);
  }

  logout() {
    sessionStorage.removeItem('authenticateUser');
    this.loggedIn$.next(false);
    this.router.navigate(['login']);
  }
}
