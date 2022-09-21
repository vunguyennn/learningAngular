import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { HardcodedAuthenticationService } from '@pendo/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username = 'vunguyen';
  password = '123456';
  errorMessageLogin = 'Invalid username or password';
  invalidLogin = false;
  hide = true;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  loading = false;
  redirectUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hardcodedAuthenticationService: HardcodedAuthenticationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.redirectUrl = this.route.snapshot.queryParams['returnUrl'] || 'home';
    console.log('😎 ~ this.redirectUrl', this.redirectUrl);
  }

  async handleLogin() {
    this.loading = true;

    try {
      const loggedIn: boolean =
        await this.hardcodedAuthenticationService.authenticate(
          this.username,
          this.password
        );

      this.snackBar.open(loggedIn ? 'ok' : 'no ok', undefined, {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

      this.loading = false;

      if (loggedIn) {
        this.router.navigateByUrl(this.redirectUrl);
        this.invalidLogin = false;
      } else {
        this.invalidLogin = true;
      }
    } catch (e) {
      this.loading = false;
      this.snackBar.open('Invalid username or password', undefined, {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
}
