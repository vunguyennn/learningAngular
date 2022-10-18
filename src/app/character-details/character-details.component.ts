import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Character,
  CharacterService,
  ElementService,
  WeaponService,
  WeaponTypeService,
} from '@pendo/services';
import {
  combineLatest,
  filter,
  first,
  firstValueFrom,
  Subject,
  tap,
} from 'rxjs';
import { SkillService } from 'src/services/skill/skill.service';

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
    private weaponTypeService: WeaponTypeService,
    private skillService: SkillService,
    private weaponService: WeaponService
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
      this.skillService.skill$$,
      this.weaponService.weapon$$,
    ])
      .pipe(
        filter(([characters, elements, weaponTypes, skills, weapons]) => {
          return (
            !!characters?.length &&
            !!elements?.length &&
            !!weaponTypes?.length &&
            !!skills?.length &&
            !!weapons?.length
          );
        }),
        first(),
        tap(([characters, elements, weaponTypes, skills, weapons]) => {
          const character = characters.find(
            (c) => c.name.toLowerCase().trim() === name
          );

          // If characters not being mapped to class before
          // These methods below will be error
          character.mapElement(elements);
          character.mapWeaponType(weaponTypes);
          character.mapSkill(skills);
          character.mapWeapon(weapons);

          // MAP.....

          this.activeCharacter = character;
          console.log('😎 ~ this.activeCharacter', this.activeCharacter);
        })
      )
      .subscribe();
  }
}
