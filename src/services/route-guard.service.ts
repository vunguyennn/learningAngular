import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { combineLatest, firstValueFrom, of, switchMap, tap } from 'rxjs';
import { AccountService } from './account/account.service';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService implements CanActivate {
  constructor(public router: Router, private accountService: AccountService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return combineLatest([
      this.accountService.loggedIn$,
      this.accountService.account$$,
    ]).pipe(
      switchMap(([isLoggedIn, account]) => {
        if (isLoggedIn) {
          if (route.routeConfig.path !== 'home') {
            return of(true);
          }

          if (!!account?.isAdmin) {
            return of(true);
          }

          this.router.navigate(['character']);

          return of(false);
        } else {
          this.router.navigate(['login'], {
            queryParams: { returnUrl: state.url },
          });

          return of(false);
        }
      })
    );
  }
}
