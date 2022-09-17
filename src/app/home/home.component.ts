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
import { finalize, firstValueFrom, forkJoin, map, pipe, tap } from 'rxjs';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { DialogComponent, DialogInput } from '../dialog/dialog.component';
import {
  ApiService,
  Character,
  Element,
  UploadImageReq,
  WeaponType,
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
  imgUrl: UploadImageReq[] = [];
  weaponType: WeaponType[] = [];

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
      this.api.getWeaponType(),
    ])
      .pipe(
        map(([characters, elements, weaponType]) => {
          this.weaponType = weaponType;
          this.elements = elements;

          return characters.map((char) => {
            const weapon = weaponType.find((el) => char.weapon === el.id);
            const element = elements.find((el) => char.element === el.id);
            return {
              ...char,
              weaponName: weapon?.name,
              element: element?.name,
            };
          });
        }),

        tap((characters) => {
          this.dataSource.data = characters;
        }),

        finalize(() => (this.initializing = false))
      )
      .subscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    //! filter at UI => use client's variables instead of fetch API
    // forkJoin([this.api.getCharacters(), this.api.getWeaponType()])
    //   .pipe(
    //     map(([characters, weaponType]) => {
    //       this.weaponType = weaponType;

    //       return characters.map((char) => {
    //         const weapon = weaponType.find((el) => char.weaponTypes === el.id);
    //         return {
    //           ...char,
    //           weaponName: weapon?.name,
    //         };
    //       });
    //     }),
    //     tap((characters) => {
    //       this.chars = characters;
    //       this.dataSource.data = this.chars;
    //     })
    //   )
    //   .subscribe();
  }

  // forkJoin([this.api.getCharacters()])

  // character can be passed or not (if not -> null)
  // edit & create
  storeCharacter(character?: Character) {
    this.dialog
      .open(DialogComponent, {
        width: '450px',
        autoFocus: false,
        //! Add type for warning if pass wrong fields
        data: {
          character: character,
          elements: this.elements,
          weaponTypes: this.weaponType,
        } as DialogInput,
        disableClose: true,
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

  async deleteAllCharacter() {
    const message = `Are u sure deleting all items?`;

    this.dialog
      .open(DeleteConfirmationDialogComponent, {
        width: '450px',
        data: {
          message,
          elements: this.elements,
        },
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        tap(async (confirm) => {
          if (confirm) {
            // Delete here
            this.api
              .deleteAllCharacter()
              .pipe(
                tap((characters: Character[]) => {
                  this.snackBar.open('Deleted all successfully !!!', '🤑🤑🤑', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.chars = characters;
                  this.dataSource.data = this.chars;
                })
              )
              .subscribe();
          }
        })
      )
      .subscribe();
    await new Promise((f) => setTimeout(f, 2000));
    this.ngOnInit();
  }

  async openDialogDelete(character: Character) {
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
        disableClose: true,
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
                tap((characters: Character[]) => {
                  this.snackBar.open('Deleted all successfully !!!', '🤑🤑🤑', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.chars = characters;
                  this.dataSource.data = this.chars;
                })
              )
              .subscribe();
          }
        })
      )
      .subscribe();
    await new Promise((f) => setTimeout(f, 2000));
    this.ngOnInit();
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
