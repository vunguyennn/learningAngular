import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Character {
  id: number;
  name: string;
  element: number;
  weapon: number;
  imgUrl: string;
  // weaponTypes: number;
}

export interface LoginRes {
  valid: boolean;
}

export interface Account {
  username: string;
  password: string;
}

export interface Element {
  id: number;
  name: string;
  iconUrl: string;
}

export interface UploadImageReq {
  blob: string;
  name: string;
}

export interface Weapon {
  id: number;
  name: string;
  iconUrl: string;
  baseAtk: string;
  effectName: string;
  description: string;
  weaponType: number;
  rarity: number;
}

export interface WeaponType {
  id: number;
  name: string;
  iconUrl: string;
}

export interface File {
  blob: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // http.get<Character[]> ==> the api returns Character[]
  getCharacters(): Observable<Character[]> {
    return this.http.get<Character[]>('api/char');
  }

  postCharacter(character: Character) {
    return this.http.post<Character[]>('api/char', character);
  }

  updateCharacter(character: Character) {
    return this.http.put<Character[]>(`api/char/${character.id}`, character);
  }

  deleteCharacter(id: number) {
    return this.http.delete<Character[]>(`api/char/${id}`);
  }

  login(account: Account) {
    return this.http.post<LoginRes>('api/login', account);
  }

  getElement(): Observable<Element[]> {
    return this.http.get<Element[]>('api/element');
  }

  getWeapon() {
    return this.http.get<Weapon[]>('api/weapon');
  }

  getWeaponType() {
    return this.http.get<WeaponType[]>('api/weaponType');
  }

  uploadImage(data: Partial<UploadImageReq>) {
    return this.http.post('api/char/image', data);
  }

  deleteAllCharacter() {
    return this.http.delete<Character[]>(`api/char`);
  }
}
