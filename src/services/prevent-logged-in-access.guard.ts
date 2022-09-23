import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { HardcodedAuthenticationService } from './hardcoded-authentication.service';

@Injectable({
  providedIn: 'root',
})
export class PreventLoggedInAccessGuard implements CanActivate {
  constructor(
    public router: Router,
    public hardcodedAuthenticationService: HardcodedAuthenticationService
  ) {}

  canActivate() {
    const loggedIn = this.hardcodedAuthenticationService.isUserLoggedIn();

    return !loggedIn;
  }
}
