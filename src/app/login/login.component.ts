import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, SNACKBAR_POSITION } from '@pendo/services';
import { finalize, tap } from 'rxjs';

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
  loading = false;
  redirectUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.redirectUrl =
      this.route.snapshot.queryParams['returnUrl'] || 'character';
    console.log('😎 ~ this.redirectUrl', this.redirectUrl);
  }

  async handleLogin() {
    this.loading = true;

    this.accountService
      .login({
        username: this.username,
        password: this.password,
      })
      .pipe(
        tap((_) => {
          this.snackBar.open(
            `Login successfully`,
            undefined,
            SNACKBAR_POSITION
          );

          this.router.navigateByUrl(this.redirectUrl);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe();
  }

  registerNavigate() {
    this.router.navigate(['register']);
  }
}
