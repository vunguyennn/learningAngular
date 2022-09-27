import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { tap } from 'rxjs';
import { AccountService } from './account/account.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(public router: Router, private accountService: AccountService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.isAdmin$.pipe(
      tap((isAdmin$) => {
        console.log('😎 ~ isAdmin', isAdmin$);
        if (isAdmin$) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
