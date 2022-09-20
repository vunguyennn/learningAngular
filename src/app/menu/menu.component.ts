import { Component, OnInit } from '@angular/core';
import { HardcodedAuthenticationService } from '@pendo/services';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  isUserLoggedIn$!: Observable<boolean>;

  constructor(
    private hardcodedAuthenticationService: HardcodedAuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isUserLoggedIn$ = this.hardcodedAuthenticationService.loggedIn$;
  }

  public onToggleSidenav = () => {};

  toggleHome() {
    this.router.navigate(['home']);
  }
  toggleCharacter() {
    this.router.navigate(['character']);
  }
}
