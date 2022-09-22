import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AccountService } from './account/account.service';

@Injectable({
  providedIn: 'root',
})
export class HardcodedAuthenticationService {
  loggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private accountService: AccountService, private router: Router) {}

  async authenticate(username: string, password: string) {
    const loginRes = await firstValueFrom(
      this.accountService.login({ username, password })
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
    return !!user;
  }

  logout() {
    sessionStorage.removeItem('authenticateUser');
    this.loggedIn$.next(false);
    this.router.navigate(['login']);
  }
}
