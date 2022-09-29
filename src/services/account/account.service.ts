import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, tap } from 'rxjs';
import jwt_decode from 'jwt-decode';

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
  private account$ = new BehaviorSubject<Account>(null);
  account$$ = this.account$.asObservable();
  setAccount(account: Account) {
    this.account$.next(account);
  }

  loggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  isLoggedIn() {
    const accessToken = this.cookieService.get(ACCESS_TOKEN);
    const refreshToken = this.cookieService.get(REFRESH_TOKEN);
    const isLoggedIn = !!(accessToken && refreshToken);
    const decodedToken = this.getDecodedAccessToken(accessToken);
    console.log('😎 ~ decodedToken', decodedToken);

    if (decodedToken) {
      this.setAccount({
        username: decodedToken.username,
        isAdmin: decodedToken.isAdmin,
      });
    }
   
    this.loggedIn$.next(isLoggedIn);
    return isLoggedIn;
  }

  login(account: Account) {
    return this.http.post<LoginRes>('api/account/login', account).pipe(
      tap(({ accessToken, refreshToken }) => {
        this.cookieService.set(ACCESS_TOKEN, accessToken);
        this.cookieService.set(REFRESH_TOKEN, refreshToken);
        const decodedToken = this.getDecodedAccessToken(accessToken);
        console.log('😎 ~ decodedToken', decodedToken);

        if (decodedToken) {
          this.setAccount({
            username: decodedToken.username,
            isAdmin: decodedToken.isAdmin,
          });
        }

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

  register(account: Account) {
    return this.http.post<Account>('api/account/regist', account);
  }

  refreshToken(refreshToken: string) {
    return this.http
      .post<LoginRes>('api/account/refresh', { refreshToken })
      .pipe(
        tap((tokens) => {
          this.cookieService.set(ACCESS_TOKEN, tokens.accessToken);
          this.cookieService.set(REFRESH_TOKEN, tokens.refreshToken);
          const decodedToken = this.getDecodedAccessToken(tokens.accessToken);
          console.log('😎 ~ decodedToken', decodedToken);

          if (decodedToken) {
            this.setAccount({
              username: decodedToken.username,
              isAdmin: decodedToken.isAdmin,
            });
          }
        })
      );
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
