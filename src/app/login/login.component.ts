import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HardcodedAuthenticationService } from '../service/hardcoded-authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username = 'VuNguyen';
  password = '';
  errorMessageLogin = 'Invalid username or password';
  invalidLogin = false;
  hide = true;

  constructor(
    private router: Router,
    private hardcodedAuthenticationService: HardcodedAuthenticationService
  ) {}

  ngOnInit(): void {}

  handleLogin() {
    // console.log(this.username);
    // if (this.username === 'VuNguyen' && this.password === '123') {
    //   this.router.navigate(['welcome']);
    //   this.invalidLogin = false;
    // } else {
    //   this.invalidLogin = true;
    // }
    if (
      this.hardcodedAuthenticationService.authenticate(
        this.username,
        this.password
      )
    ) {
      // this.invalidLogin = !(
      //   this.username === 'VuNguyen' && this.password === '123'
      // );
      this.router.navigate(['welcome', this.username]);
      this.invalidLogin = false;
    } else {
      this.invalidLogin = true;
    }
  }
  // if (!this.invalidLogin) {
  //   this.router.navigate(['welcome', this.username]);
  // }
}
