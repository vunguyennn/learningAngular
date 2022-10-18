import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Weapon } from './weapon.model';

@Injectable({
  providedIn: 'root',
})
export class WeaponService {
  private weapon$ = new BehaviorSubject<Weapon[]>(null);
  weapon$$ = this.weapon$.asObservable();

  setWeapon(weapon: Weapon[]) {
    this.weapon$.next(weapon);
  }

  constructor(private http: HttpClient) {}

  getWeapon() {
    return this.http
      .get<Weapon[]>('api/weapon')
      .pipe(tap((weapon) => this.setWeapon(weapon)));
  }
}
