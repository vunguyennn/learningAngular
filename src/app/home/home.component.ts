import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
  Character,
  CharacterService,
  Element,
  ElementService,
  UploadImageReq,
  WeaponType,
  WeaponTypeService,
} from '@pendo/services';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  firstValueFrom,
  fromEvent,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';
import * as _ from 'lodash';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('weapon', {static: true}) weapon: MatSelect;
  @ViewChild('element', {static: true}) element: MatSelect;
  @ViewChild('inputName', {static: true}) inputName: ElementRef;

  title = 'token-interceptor';
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  loading = false;
  initializing = true;
  productForm!: FormGroup;
  displayedColumns: string[] = ['img', 'name', 'element', 'weapon', 'action'];
  chars: Character[] = [];
  dataSource = new MatTableDataSource<Character>();
  elements: Element[] = [];
  imgUrl: UploadImageReq[] = [];
  weaponTypes: WeaponType[] = [];

  destroy$ = new Subject();
  // create an observable property
  weaponTypes$: Observable<WeaponType[]>;
  elements$: Observable<Element[]>;
  character$: Observable<Character>;
  characters: Character[];

  constructor(
    public dialog: MatDialog,
    private characterService: CharacterService,
    private elementService: ElementService,
    private weaponTypeService: WeaponTypeService
  ) {}

  ngOnDestroy(): void {
    //* When destroy => set active character to null
    this.characterService.setActiveCharacter(null);
    // When the component destroy => trigger this subject
    // On any observable, check if this subject is triggered => unsubscribe
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  async ngOnInit(): Promise<void> {
    // change to combineLatest bz of fetching data first time at app component
    // listen to data in store, not fetch new APIs
    combineLatest([
      this.characterService.characters$$,
      this.elementService.elements$$,
      this.weaponTypeService.weaponTypes$$,
    ])
      .pipe(
        takeUntil(this.destroy$),
        // only handle available data case
        //! check until 3 observable done emitting value then handle data
        filter(([characters, elements, weaponTypes]) => {
          return (
            !!characters?.length && !!elements?.length && !!weaponTypes?.length
          );
        }),
        // ([characters, elements, weaponTypes]) is shortcut of (result) that destructuring the value of result
        map(([characters, elements, weaponTypes]) => {
          console.log('😎 ~ weaponTypes', weaponTypes);
          console.log('😎 ~ elements', elements);
          console.log('😎 ~ characters', characters);

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
          this.characters = characters;
          this.dataSource.data = this.characters;
          console.log('😎 ~ this.dataSource.data', this.dataSource.data);
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          }, 0);
        }),
        // Listen to changes after data init
        // => set data for initialize value of dropdowns
        tap(() => {
          this.listenElements();
        }),
        tap(() => (this.initializing = false))
        //! combineLatest doesn't use finalize bz it always listen until the time it being complete (takeUntil(this.destroy$))
        // finalize(() => (this.initializing = false))
      )
      .subscribe();

    // this.characterService.characters$$
    //   .pipe(
    //     takeUntil(this.destroy$),
    //     tap((characters) => {
    //       this.characters = characters;
    //       console.log('😎 ~ this.characters', this.characters);
    //     })
    //   )
    //   .subscribe();
    // this.elements$ = this.elementService.elements$$;
    // console.log('😎 ~ this.elements$', this.elements$);
    // this.weaponTypes$ = this.weaponTypeService.weaponTypes$$;
  }

  listenElements() {
    const initElement = -1;
    const initWeaponType = -1;

    combineLatest([
      this.element.valueChange.pipe(startWith(initElement)),
      this.weapon.valueChange.pipe(startWith(initWeaponType)),
      //! add 1 more obs here for search
      fromEvent(this.inputName.nativeElement, 'input')
        //! Use debounce, distinctUntilChanged if fetch api on search
        // debounceTime(500),
        // distinctUntilChanged(),
        .pipe(startWith('')),
    ])
      .pipe(
        takeUntil(this.destroy$),
        tap(([element, weaponType, search]) => {
          const keyword =
            typeof search === 'string'
              ? ''
              : ((search as any).target.value as string).toLowerCase().trim();
          console.log('😎 ~ keyword', keyword);
          console.log('😎 ~ search', search);
          this.dataSource.data = this.characters.filter((character) => {
            const searchCondition = () =>
              character.name.toLowerCase().trim().includes(keyword);
            let filterCondition: Function;

            if (element === -1 && weaponType === -1) {
              filterCondition = null;
            } else if (element === -1) {
              filterCondition = () => character.weapon === weaponType;
            } else if (weaponType === -1) {
              filterCondition = () => character.element === element;
            } else {
              filterCondition = () =>
                character.element === element &&
                character.weapon === weaponType;
            }

            return filterCondition
              ? searchCondition() && filterCondition()
              : searchCondition();
          });
          console.log('😎 ~ weapon', weaponType);
          console.log('😎 ~ element', element);
        })
      )
      .subscribe();

    this.element.value = initElement;
    this.weapon.value = initWeaponType;
  }

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
