import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit(): void {}

  handleLogin() {
    // console.log(this.username);
    if (this.username === 'VuNguyen' && this.password === '123') {
      this.router.navigate(['welcome']);
      this.invalidLogin = false;
    } else {
      this.invalidLogin = true;
    }
  }
}
