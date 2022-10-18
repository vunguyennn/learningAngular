import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  regisForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

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

  ngOnInit(): void {}

  register() {
    this.loading = true;

    this.accountService
      .register({
        username: this.regisForm.value.username,
        password: this.regisForm.value.password,
      })
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
