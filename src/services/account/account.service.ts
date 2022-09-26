import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, tap } from 'rxjs';

import {
  ACCESS_TOKEN,
  Account,
  LoginRes,
  REFRESH_TOKEN,
} from './account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  loggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  isLoggedIn() {
    const accessToken = this.cookieService.get(ACCESS_TOKEN);
    const refreshToken = this.cookieService.get(REFRESH_TOKEN);
    const isLoggedIn = !!(accessToken && refreshToken);
    this.loggedIn$.next(isLoggedIn);
    return isLoggedIn;
  }

  login(account: Account) {
    return this.http.post<LoginRes>('api/account/login', account).pipe(
      tap(({ accessToken, refreshToken }) => {
        this.cookieService.set(ACCESS_TOKEN, accessToken);
        this.cookieService.set(REFRESH_TOKEN, refreshToken);
        this.loggedIn$.next(true);
      })
    );
  }

  logout() {
    return this.http.delete('api/account/logout').pipe(
      tap((_) => {
        this.cookieService.delete(ACCESS_TOKEN);
        this.cookieService.delete(REFRESH_TOKEN);
        this.loggedIn$.next(false);
      })
    );
  }

  refreshToken(refreshToken: string) {
    return this.http.post<LoginRes>('api/account/refresh', { refreshToken });
  }

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  storeAccessToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
  }

  removeTokens() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }
}
