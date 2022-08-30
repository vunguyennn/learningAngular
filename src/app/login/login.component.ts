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
  validLogin = false;

  constructor() {}

  ngOnInit(): void {}

  handleLogin() {
    if (this.username === 'VuNguyen' && this.password === '123') {
      this.validLogin = false;
    } else {
      this.validLogin = true;
    }
    // console.log(this.username);
  }
}
