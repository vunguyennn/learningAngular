import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  ACCESS_TOKEN,
  AccountService,
  CharacterService,
  ElementService,
  REFRESH_TOKEN,
  SNACKBAR_POSITION,
  WeaponTypeService,
} from '@pendo/services';
import { CookieService } from 'ngx-cookie-service';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  // prevent calling multiple refresh token apis
  refreshingTokens: boolean;
  accessToken$ = new BehaviorSubject<string>(null);

  constructor(
    private snackBar: MatSnackBar,
    private cookieService: CookieService,
    private accountService: AccountService,
    private router: Router,
    private characterService: CharacterService,
    private elementService: ElementService,
    private weaponTypeService: WeaponTypeService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.cookieService.get(ACCESS_TOKEN);
    const refreshToken = this.cookieService.get(REFRESH_TOKEN);

    const requestOptions: any = {
      url: `https://pendo-api-eu.herokuapp.com/${request.url}`,
    };

    if (request.url !== 'api/account/login') {
      requestOptions.setHeaders = {
        Authorization: `Bearer ${accessToken}`,
      };
    }

    const cloneRequest = request.clone(requestOptions);

    return next.handle(cloneRequest).pipe(
      // Handle error of all http requests
      catchError((error: HttpErrorResponse) => {
        // access token expired
        if (error.status === 403) {
          if (!this.refreshingTokens) {
            this.refreshingTokens = true;
            this.accessToken$.next(null);

            return this.accountService.refreshToken(refreshToken).pipe(
              switchMap((tokens) => {
                this.accessToken$.next(tokens.accessToken);
                this.cookieService.set(ACCESS_TOKEN, tokens.accessToken);
                this.cookieService.set(REFRESH_TOKEN, tokens.refreshToken);

                const requestWithNewTokens = request.clone({
                  ...requestOptions,
                  setHeaders: {
                    Authorization: `Bearer ${tokens.accessToken}`,
                  },
                });

                return next.handle(requestWithNewTokens);
              }),
              //* handle case refresh token expired
              catchError((e) => {
                this.cookieService.delete(ACCESS_TOKEN);
                this.cookieService.delete(REFRESH_TOKEN);
                this.accountService.loggedIn$.next(false);
                this.router.navigate(['login']);
                this.characterService.setCharacters(null);
                this.elementService.setElements(null);
                this.weaponTypeService.setWeaponTypes(null);

                return throwError(() => e);
              }),
              finalize(() => (this.refreshingTokens = false))
            );
          } else {
            return this.accessToken$.pipe(
              filter((token) => token != null),
              take(1),
              switchMap((accessToken) => {
                const requestWithNewTokens = request.clone({
                  ...requestOptions,
                  setHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                });
                return next.handle(requestWithNewTokens);
              })
            );
          }
        }
        // refresh token expired
        else if (error.status === 419) {
          this.snackBar.open(
            'Your session has expired',
            undefined,
            SNACKBAR_POSITION
          );
          return throwError(() => error);
        } else if (error.status !== 403) {
          this.snackBar.open(
            error.error?.message ?? 'Something went wrong',
            undefined,
            SNACKBAR_POSITION
          );

          return throwError(() => error);
        } else {
          return throwError(() => error);
        }
      })
    );
  }
}
