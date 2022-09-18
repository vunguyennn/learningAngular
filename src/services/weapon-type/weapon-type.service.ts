import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { WeaponType } from './weapon-type.model';

@Injectable({
  providedIn: 'root',
})
export class WeaponTypeService {
  private weaponTypes: WeaponType[] = [];
  private weaponTypes$ = new BehaviorSubject(this.weaponTypes);
  weaponTypes$$ = this.weaponTypes$.asObservable();

  setWeaponTypes(weaponTypes: WeaponType[]) {
    this.weaponTypes$.next(weaponTypes);
  }

  constructor(private http: HttpClient) {}

  getWeaponType() {
    return this.http
      .get<WeaponType[]>('api/weaponType')
      .pipe(tap((weaponTypes) => this.setWeaponTypes(weaponTypes)));
  }
}
