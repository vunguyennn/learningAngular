import { Component, Input, OnInit, ViewChild } from '@angular/core';

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
import {
  Character,
  CharacterService,
  Element,
  ElementService,
  UploadImageReq,
  WeaponType,
  WeaponTypeService,
} from '@pendo/services';
import { finalize, firstValueFrom, forkJoin, map, tap } from 'rxjs';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  title = 'token-interceptor';
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
  weaponTypes: WeaponType[] = [];

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private characterService: CharacterService,
    private elementService: ElementService,
    private weaponTypeService: WeaponTypeService
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async ngOnInit(): Promise<void> {
    forkJoin([
      this.characterService.getCharacters(),
      this.elementService.getElements(),
      this.weaponTypeService.getWeaponType(),
    ])
      .pipe(
        map(([characters, elements, weaponTypes]) => {
          this.weaponTypes = weaponTypes;
          this.elements = elements;

          // Add interface for strict map value
          return characters.map((char) => {
            const weapon = weaponTypes.find((el) => char.weapon === el.id);
            const element = elements.find((el) => char.element === el.id);
            return {
              ...char,
              weaponName: weapon.name,
              // element: element?.name, // No element field
              elementName: element.name,
            };
          }) as Character[];
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
    //* If character !== null => set active for it
    if (character) {
      this.characterService.setActiveCharacter(character.id);
    }

    this.dialog
      .open(DialogComponent, {
        width: '450px',
        autoFocus: false,
        //! Add type for warning if pass wrong fields
        // data: {
        //   character: character,
        //   // Get value from store => don't need parent to pass elements in
        //   // elements: this.elements,
        //   // weaponTypes: this.weaponTypes,
        // } as DialogInput,
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        tap(async (isSuccess) => {
          if (isSuccess) {
            // API return new character list, dont need to fetch GET
            const characters = await firstValueFrom(
              this.characterService.getCharacters()
            );
            this.dataSource.data = this.getMappedCharacters(characters);
            console.log('😎 ~ characters', characters);
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
            this.characterService
              .deleteAllCharacters()
              .pipe(
                tap(async (_) => {
                  const characters = await firstValueFrom(
                    this.characterService.getCharacters()
                  );
                  this.dataSource.data = this.getMappedCharacters(characters);
                  console.log('😎 ~ characters', characters);
                })
              )
              .subscribe();
          }
        })
      )
      .subscribe();
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
            this.characterService
              .deleteCharacter(character.id)
              .pipe(
                tap(async (_) => {
                  const characters = await firstValueFrom(
                    this.characterService.getCharacters()
                  );
                  this.dataSource.data = this.getMappedCharacters(characters);
                  console.log('😎 ~ characters', characters);
                })
              )
              .subscribe();
          }
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

  getMappedCharacters(characters: Character[]) {
    return characters.map((char) => {
      const weapon = this.weaponTypes.find((el) => char.weapon === el.id);
      const element = this.elements.find((el) => char.element === el.id);
      return {
        ...char,
        weaponName: weapon.name,
        elementName: element.name,
      };
    }) as Character[];
  }
}
