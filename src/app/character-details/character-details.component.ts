import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Character,
  CharacterService,
  ElementService,
  WeaponService,
  WeaponType,
  WeaponTypeService,
} from '@pendo/services';
import {
  combineLatest,
  filter,
  first,
  forkJoin,
  map,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss'],
})
export class CharacterDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private characterService: CharacterService,
    private elementService: ElementService,
    private weaponTypeService: WeaponTypeService
  ) {}

  destroy$ = new Subject();
  elements: Element[] = [];
  characters: Character[] = [];
  weaponTypes: WeaponType[] = [];
  character: Character;

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    //https://stackoverflow.com/questions/41138081/do-i-have-to-unsubscribe-from-activatedroute-e-g-params-observables
    const { name } = this.route.snapshot.params;
    const lowerName = (name as string).toLowerCase().trim();
    console.log('😎 ~ lowerName', lowerName);

    combineLatest([
      this.characterService.characters$$,
      this.elementService.elements$$,
      this.weaponTypeService.weaponTypes$$,
    ])
      .pipe(
        takeUntil(this.destroy$),
        filter(([characters, elements, weaponTypes]) => {
          return (
            !!characters.length && !!elements.length && !!weaponTypes.length
          );
        }),
        map(([characters, elements, weaponTypes]) => {
          this.weaponTypes = weaponTypes;
          this.elements = elements;

          return characters.map((char) => {
            const weapon = weaponTypes.find((el) => char.weapon === el.id);
            const element = elements.find((el) => char.element === el.id);
            return {
              ...char,
              weaponName: weapon.name,
              elementName: element.name,
              elementUrl: element.iconUrl,
              weaponUrl: weapon.iconUrl,
            };
          }) as Character[];
        }),
        tap((characters) => {
          this.character = characters.find((character) => {
            return character.name.toLowerCase().trim() === lowerName;
          });
          console.log('😎 ~ this.character', this.character);
        })
      )
      .subscribe();
  }
}
