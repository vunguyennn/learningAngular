import { Component, OnInit } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { HardcodedAuthenticationService } from './service/hardcoded-authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // template: '<h1>{{name}}</h1>',
  styleUrls: ['./app.component.css'],
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
