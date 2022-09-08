import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HardcodedAuthenticationService } from '../service/hardcoded-authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  isUserLoggedIn$!: Observable<boolean>;

  constructor(
    public HardcodedAuthenticationService: HardcodedAuthenticationService
  ) {}

  ngOnInit(): void {
    this.isUserLoggedIn$ = this.HardcodedAuthenticationService.logedIn$;
  }

  public onToggleSidenav = () => {};
}
