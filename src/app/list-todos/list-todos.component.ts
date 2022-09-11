import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, tap } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService, Character } from '../services/api.service';
import { MatIcon } from '@angular/material/icon';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-list-todos',
  templateUrl: './list-todos.component.html',
  styleUrls: ['./list-todos.component.css'],
})
export class ListTodosComponent implements OnInit {
  title = 'token-interceptor';
  result = {};
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  productForm!: FormGroup;
  dialogRef: any;
  dialogRef2: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  displayedColumns: string[] = ['name', 'element', 'action'];
  chars: Character[] = [];
  dataSource = new MatTableDataSource();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    public dialog: MatDialog,
    private api: ApiService,
    http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    const path = 'https://pendo-api.herokuapp.com/api/char';
    this.result = http.get(path);
  }

  async ngOnInit(): Promise<void> {
    // this.api
    //   .getCharacters()
    //   .pipe(
    //     tap((chars) => {
    //       this.chars = chars;
    //       console.log('😎 ~ this.chars', this.chars);
    //       this.dataSource.data = this.chars;
    //     })
    //   )
    //   .subscribe();

    // OR
    this.chars = await firstValueFrom(this.api.getCharacters());
    this.dataSource.data = this.chars;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.api
        .getCharacters()
        .pipe(
          tap((chars) => {
            this.chars = chars;
            this.dataSource.data = this.chars;
          })
        )
        .subscribe();
    });
  }

  updateCharacter(element: Character) {
    const dialogRef2 = this.dialog.open(DialogComponent, {
      width: '250px',
      data: element,
    });
    dialogRef2.afterClosed().subscribe((result) => {
      this.api
        .getCharacters()
        .pipe(
          tap((chars) => {
            this.chars = chars;
            this.dataSource.data = this.chars;
          })
        )
        .subscribe();
    });
  }

  deleteCharacter(name: string) {
    this.api.deleteCharacter(name).subscribe({
      next: (res) => {
        this.snackBar.open('Deleted ' + name + ' successfully !!!', '🤑🤑🤑', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

        this.api
          .getCharacters()
          .pipe(
            tap((chars) => {
              this.chars = chars;
              this.dataSource.data = this.chars;
            })
          )
          .subscribe();
      },
      error: () => {
        alert('Failed');
      },
    });
  }
}
