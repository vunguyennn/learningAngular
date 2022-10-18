import { Element } from '../element/element.model';
import { Skill } from '../skill/skill.model';
import { WeaponType } from '../weapon-type/weapon-type.model';
import { Weapon } from '../weapon/weapon.model';

//* 2 type because:
//* number[] is the type that the apis response which is an array of skill's id
//* Skill[] is the type that UI map from skill's to Skill for rendering data
//* and Weapon vice versa.
type SKILL = number[] | Skill[] | any;
type WEAPON = number[] | Weapon[] | any;

//TODO: change element, and weaponType into type like SKILL, WEAPON
//! Currently, In this project having 3 places need to map apis to get needed data of Character
//! And in future, if having some more components -> have to use combineLatest to map apis again -> complex
//! Solution: change from interface to class, add get set method to it for mapping things
//! Increase the easy, reuseable of using Character later
export class Character {
  id: number;
  name: string;
  imgUrl: string;
  rarity: number;
  description: string;

  // Element
  element: number; // element id
  elementName?: string; // add `?`: the field can be null
  elementUrl: string;

  // Weapon Type
  weapon: number; // weapon type id
  weaponName: string;
  weaponUrl: string;

  skills: SKILL;
  recommendWeapons: WEAPON;

  //* Partial: any field in this class can be null or undefined
  constructor(obj: Partial<Character>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }

  mapElement(elements: Element[]) {
    const element = elements.find((el) => {
      return this.element === el.id;
    });
    this.elementUrl = element.iconUrl;
    this.elementName = element.name;
  }

  mapWeaponType(weaponTypes: WeaponType[]) {
    const weaponType = weaponTypes.find((el) => this.weapon === el.id);
    this.weaponUrl = weaponType.iconUrl;
    this.weaponName = weaponType.name;
  }

  mapSkill(skills: Skill[]) {
    this.skills = (this.skills as number[]).map((skill) =>
      skills.find((s) => s.id === skill)
    ) as Skill[];
  }

  mapWeapon(weapons: Weapon[]) {
    this.recommendWeapons = (this.recommendWeapons as number[]).map(
      (recommendWeapon) => weapons.find((w) => w.id === recommendWeapon)
    ) as Weapon[];
  }
}

export interface UploadImageReq {
  blob: string;
  name: string;
}

export interface CharacterByElement {
  [elementId: string]: {
    element: Element;
    characters: Character[];
  };
}
