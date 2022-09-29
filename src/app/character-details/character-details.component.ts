import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Character,
  CharacterService,
  ElementService,
  WeaponTypeService,
} from '@pendo/services';
import {
  combineLatest,
  filter,
  first,
  firstValueFrom,
  map,
  Observable,
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
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private elementService: ElementService,
    private weaponTypeService: WeaponTypeService
  ) {}

  destroy$ = new Subject();
  activeCharacter: Character;

  async ngOnInit(): Promise<void> {
    const activeCharacter: Character = await firstValueFrom(
      this.characterService.activeCharacter$$
    );

    let name: string;

    if (activeCharacter) {
      name = activeCharacter.name.toLowerCase().trim();
    } else {
      //https://stackoverflow.com/questions/41138081/do-i-have-to-unsubscribe-from-activatedroute-e-g-params-observables
      const { name: nameParam } = this.route.snapshot.params;
      name = nameParam.toLowerCase().trim();
    }

    combineLatest([
      this.characterService.characters$$,
      this.elementService.elements$$,
      this.weaponTypeService.weaponTypes$$,
    ])
      .pipe(
        filter(([characters, elements, weaponTypes]) => {
          return (
            !!characters?.length && !!elements?.length && !!weaponTypes?.length
          );
        }),
        first(),
        tap(([characters, elements, weaponTypes]) => {
          const character = characters.find(
            (c) => c.name.toLowerCase().trim() === name
          );
          const weapon = weaponTypes.find((el) => character.weapon === el.id);
          const element = elements.find((el) => character.element === el.id);

          character.weaponUrl = weapon.iconUrl;
          character.weaponName = weapon.name;
          character.elementUrl = element.iconUrl;
          character.elementName = element.name;

          this.activeCharacter = character;
          console.log('😎 ~ this.activeCharacter', this.activeCharacter);
        })
      )
      .subscribe();
  }
}
