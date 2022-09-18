import { Component, OnInit } from '@angular/core';
// This import path is too long => use short import
// import { HardcodedAuthenticationService } from '../services/hardcoded-authentication.service';
import { HardcodedAuthenticationService } from '@pendo/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // template: '<h1>{{name}}</h1>',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'Hello World';
  public name = 'Andy';

  constructor(
    private hardcodedAuthenticationService: HardcodedAuthenticationService
  ) {}

  ngOnInit() {
    this.hardcodedAuthenticationService.isUserLoggedIn();
  }
}
