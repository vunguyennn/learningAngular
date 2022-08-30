import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username = 'VuNguyen';
  password = '';
  errorMessage = 'Invalid username or password';
  invalidLogin = false;

  constructor() {}

  ngOnInit(): void {}

  handleLogin() {
    if (this.username === 'VuNguyen' && this.password === '123') {
      this.invalidLogin = false;
    } else {
      this.invalidLogin = true;
    }
    // console.log(this.username);
  }
}
