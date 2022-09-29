import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Account, AccountService, SNACKBAR_POSITION } from '@pendo/services';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  username = 'vunguyen';
  password = '123456';
  errorMessageLogin = 'Invalid username or password';
  invalidLogin = false;
  hide = true;
  loading = false;
  redirectUrl: string;
  account: Account;

  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('😎 ~ this.password', this.password);
    console.log('😎 ~ this.username', this.username);
  }

  register() {
    this.loading = true;

    this.accountService
      .register({ username: this.username, password: this.password })
      .pipe(
        tap((_) => {
          this.snackBar.open(
            `Register successfully`,
            undefined,
            SNACKBAR_POSITION
          );

          this.router.navigate(['login']);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe();
  }
}
