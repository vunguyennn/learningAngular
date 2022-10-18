import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  signInForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

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
    this.redirectUrl = this.route.snapshot.queryParams['returnUrl'] || 'home';
    console.log('😎 ~ this.redirectUrl', this.redirectUrl);
  }

  handleLogin() {
    this.loading = true;

    this.accountService
      .login({
        username: this.signInForm.value.username,
        password: this.signInForm.value.password,
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
