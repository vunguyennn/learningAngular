import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { firstValueFrom, tap } from 'rxjs';
import { AccountService } from './account/account.service';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService implements CanActivate {
  constructor(public router: Router, private accountService: AccountService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.loggedIn$.pipe(
      tap((isLoggedIn) => {
        if (isLoggedIn) {
          return true;
        } else {
          this.router.navigate(['login'], {
            queryParams: { returnUrl: state.url },
          });

          return false;
        }
      })
    );
  }
}
