import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// This import path is too long => use short import
import {
  AccountService,
  CharacterService,
  ElementService,
  WeaponTypeService,
} from '@pendo/services';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  first,
  firstValueFrom,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // template: '<h1>{{name}}</h1>',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();
  afterInit: boolean;

  constructor(
    private characterService: CharacterService,
    private elementService: ElementService,
    private weaponTypeService: WeaponTypeService,
    private accountService: AccountService,
    private router: Router
  ) {}
  //! App component will load first
  //! Check if user logged in (in route guard)
  //! true => navigate to redirect url
  // * after navigate, INTERCEPTOR check if access token | refresh token valid
  // * true => handle data
  // * false:
  // ** access token invalid: call refresh token
  // ** refresh token invalid: navigate to login (clear all cookie)
  //! false => navigate to login
  ngOnInit() {
    this.accountService.isLoggedIn();

    combineLatest([this.router.events, this.accountService.loggedIn$])
      .pipe(
        takeUntil(this.destroy$),
        filter(
          ([event, loggedIn]) => event instanceof NavigationEnd && !!loggedIn
        ),
        tap(async ([event, _]) => {
          if ((event as NavigationEnd).urlAfterRedirects === '/login') {
            this.router.navigate(['/']);
          }

          const characters = await firstValueFrom(this.characterService.characters$$.pipe(first()));
          const elements = await firstValueFrom(this.elementService.elements$$.pipe(first()));
          const weaponTypes = await firstValueFrom(this.weaponTypeService.weaponTypes$$.pipe(first()));

          if (this.afterInit && characters !== null && elements !== null && weaponTypes !== null) {
            return;
          }

          if ((event as NavigationEnd).urlAfterRedirects !== '/not-found') {
            this.afterInit = true;
            this.characterService.getCharacters().subscribe();
            this.elementService.getElements().subscribe();
            this.weaponTypeService.getWeaponType().subscribe();
          }
        })
      )
      .subscribe();
  }

  //TODO: Find a more convenient way
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
