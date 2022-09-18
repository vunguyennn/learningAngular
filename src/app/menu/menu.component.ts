import { Component, OnInit } from '@angular/core';
import { HardcodedAuthenticationService } from '@pendo/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  isUserLoggedIn$!: Observable<boolean>;

  constructor(
    private hardcodedAuthenticationService: HardcodedAuthenticationService
  ) {}

  ngOnInit(): void {
    this.isUserLoggedIn$ = this.hardcodedAuthenticationService.loggedIn$;
  }

  public onToggleSidenav = () => {};
}
