import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { finalize, firstValueFrom, forkJoin, map, tap } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService, Character, Element } from '../services/api.service';

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
  loading = false;

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
  elements: Element[] = [];

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
    // this.chars = await firstValueFrom(this.api.getCharacters());

    // https://www.learnrxjs.io/learn-rxjs/operators/combination/forkjoin
    // MUST read
    forkJoin([this.api.getCharacters(), this.api.getElement()])
      .pipe(
        map(([characters, elements]) => {
          this.elements = elements;

          return characters.map((char) => {
            const element = elements.find((el) => char.element === el.id);
            return {
              ...char,
              elementName: element?.name,
            };
          });
        }),
        tap((characters) => {
          this.chars = characters;
          this.dataSource.data = this.chars;
        })
      )
      .subscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '450px',
      data: {
        elements: this.elements,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap(async (_) => {
          const characters = await firstValueFrom(this.api.getCharacters());
          this.chars = characters.map((char) => {
            const element = this.elements.find((el) => char.element === el.id);
            return {
              ...char,
              elementName: element?.name,
            };
          });
          this.dataSource.data = this.chars;
        })
      )
      .subscribe();
  }

  updateCharacter(character: Character) {
    const dialogRef2 = this.dialog.open(DialogComponent, {
      width: '450px',
      data: {
        character: character,
        elements: this.elements,
      },
    });
    dialogRef2
      .afterClosed()
      .pipe(
        tap(async (_) => {
          const characters = await firstValueFrom(this.api.getCharacters());
          this.chars = characters.map((char) => {
            const element = this.elements.find((el) => char.element === el.id);
            return {
              ...char,
              elementName: element?.name,
            };
          });
          this.dataSource.data = this.chars;
        })
      )
      .subscribe();
  }

  deleteCharacter(id: number) {
    this.loading = true;

    this.api
      .deleteCharacter(id)
      .pipe(
        finalize(() => (this.loading = false)),
        tap(async (res) => {
          this.snackBar.open('Deleted successfully !!!', '🤑🤑🤑', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });

          const characters = await firstValueFrom(this.api.getCharacters());
          this.chars = characters.map((char) => {
            const element = this.elements.find((el) => char.element === el.id);
            return {
              ...char,
              elementName: element?.name,
            };
          });
          this.dataSource.data = this.chars;
        })
      )
      .subscribe();
  }
}
