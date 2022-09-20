import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Character,
  CharacterByElement,
  CharacterService,
  Element,
  ElementService,
  WeaponType,
} from '@pendo/services';
import {
  combineLatest,
  filter,
  forkJoin,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  message = 'Welcome';
  name = '';
  elements: Element[] = [];
  weaponTypes: WeaponType[] = [];
  characters: Character[] = [];
  elements$: Observable<Element[]>;
  charactersTest = [];
  charsByElement: CharacterByElement = {};
  destroy$ = new Subject();

  KEYS = Object.keys;

  constructor(
    private router: Router,
    private characterService: CharacterService,
    private elementService: ElementService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    //! NAVIGATE FROM HOME
    //! MUST GO TO HOME FIRST
    //! HOME CALL APIs FIRST TIME => SAVE TO STORE
    //* use forkJoin for fetching data for 1 time => forkJoin auto complete after 1 call => don't need to unsubscribe
    //* combineLatest for receiving data when the data listen to has changed => don't need to fetch data again
    //* combineLatest always listen => need to unsubscribe
    // forkJoin([
    //   this.characterService.getCharacters(),
    //   this.elementService.getElements(),
    // ])
    combineLatest([
      this.characterService.characters$$,
      this.elementService.elements$$,
    ])
      .pipe(
        takeUntil(this.destroy$),
        // only handle available data case
        //! check until 2 observable done emitting value then handle data
        filter(([characters, elements]) => {
          return !!characters.length && !!elements.length;
        }),
        // return the array with value of observable array use in combineLatest
        tap((result) => {
          console.log('😎 ~ result', result);
          this.characters = result[0];
          this.elements = result[1];

          this.characters.forEach((character) => {
            const charByElement = this.charsByElement[character.element];

            if (charByElement) {
              this.charsByElement[character.element] = {
                ...charByElement,
                characters: [...charByElement.characters, character],
              };
            } else {
              this.charsByElement[character.element] = {
                element: this.elements.find((e) => e.id === character.element),
                characters: [character],
              };
            }
          });

          console.log('😎 ~ this.charsByElement', this.charsByElement);
        })
      )
      .subscribe();
  }

  backtoHome() {
    this.router.navigate(['home']);
  }
}
