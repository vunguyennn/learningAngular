import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService, SNACKBAR_POSITION } from '@pendo/services';
import { map, tap } from 'rxjs';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  constructor(
    public accountService: AccountService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  logout() {
    this.accountService
      .logout()
      .pipe(
        tap((_) => {
          this.router.navigate(['/login']);
          this.snackBar.open(
            `Logout successfully`,
            undefined,
            SNACKBAR_POSITION
          );
        })
      )
      .subscribe();
  }
}
