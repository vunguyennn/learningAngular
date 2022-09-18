import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Weapon } from './weapon.model';

@Injectable({
  providedIn: 'root',
})
export class WeaponService {
  constructor(private http: HttpClient) {}

  getWeapon() {
    return this.http.get<Weapon[]>('api/weapon');
  }
}
