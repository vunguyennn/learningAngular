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
import { finalize, firstValueFrom, forkJoin, tap } from 'rxjs';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';
import {
  ApiService,
  Character,
  Element,
  UploadImageReq,
  Weapon,
} from '../services/api.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  title = 'token-interceptor';
  result = {};
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  loading = false;
  initializing = true;
  productForm!: FormGroup;
  displayedColumns: string[] = ['img', 'name', 'element', 'weapon', 'action'];
  chars: Character[] = [];
  dataSource = new MatTableDataSource();
  elements: Element[] = [];
  weapons: Weapon[] = [];
  imgUrl: UploadImageReq[] = [];

  constructor(
    public dialog: MatDialog,
    private api: ApiService,
    http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    const path = 'https://pendo-api.herokuapp.com/api/char';
    this.result = http.get(path);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async ngOnInit(): Promise<void> {
    forkJoin([
      this.api.getCharacters(),
      this.api.getElement(),
      this.api.getWeapon(),
    ])
      .pipe(
        tap(([characters, elements, weapons]) => {
          this.chars = characters;
          this.dataSource.data = this.chars;
          this.elements = elements;
          this.weapons = weapons;
        }),
        finalize(() => (this.initializing = false))
      )
      .subscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // character can be passed or not (if not -> null)
  // edit & create
  storeCharacter(character?: Character) {
    this.dialog
      .open(DialogComponent, {
        width: '450px',
        autoFocus: false,
        data: {
          character: character,
          elements: this.elements,
          weapons: this.weapons,
          imgUrl: this.imgUrl,
        },
      })
      .afterClosed()
      .pipe(
        tap((characters: Character[]) => {
          if (characters?.length) {
            // API return new character list, dont need to fetch GET
            console.log('😎 ~ characters', characters);
            this.chars = characters;
            this.dataSource.data = this.chars;
          }
        })
      )
      .subscribe();
  }

  deleteAllCharacter() {
    const message = `Are u sure deleting all items?`;

    this.dialog
      .open(DeleteConfirmationDialogComponent, {
        width: '450px',
        data: {
          message,
          elements: this.elements,
        },
      })
      .afterClosed()
      .pipe(
        tap(async (confirm) => {
          if (confirm) {
            // Delete here
            this.api
              .deleteAllCharacter()
              .pipe(
                finalize(() => (this.loading = false)),
                tap((res) => {
                  this.snackBar.open('Deleted all successfully !!!', '🤑🤑🤑', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                })
              )
              .subscribe();
          }
          await new Promise((f) => setTimeout(f, 1000));
          this.ngOnInit();
        })
      )
      .subscribe();
  }

  openDialogDelete(character: Character) {
    const message = `Are u sure deleting ${character.name}?`;

    // Not delete in confirm delete dialog
    // Confirm ok => delete outside => reuse this component at others
    this.dialog
      .open(DeleteConfirmationDialogComponent, {
        width: '450px',
        data: {
          message,
          elements: this.elements,
        },
      })
      .afterClosed()
      .pipe(
        tap(async (confirm) => {
          console.log('😎 ~ confirm', confirm);
          if (confirm) {
            // Delete here
            this.api
              .deleteCharacter(character.id)
              .pipe(
                finalize(() => (this.loading = false)),
                tap((res) => {
                  this.snackBar.open('Deleted successfully !!!', '🤑🤑🤑', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                })
              )
              .subscribe();
          }
          await new Promise((f) => setTimeout(f, 1000));
          this.ngOnInit();
        })
      )
      .subscribe();
  }

  // deleteCharacter(id: number) {
  //   this.loading = true;

  //   this.api
  //     .deleteCharacter(id)
  //     .pipe(
  //       finalize(() => (this.loading = false)),
  //       tap(async (res) => {
  //         this.snackBar.open('Deleted successfully !!!', '🤑🤑🤑', {
  //           horizontalPosition: this.horizontalPosition,
  //           verticalPosition: this.verticalPosition,
  //         });
  //       })
  //     )
  //     .subscribe();
  // }
}
