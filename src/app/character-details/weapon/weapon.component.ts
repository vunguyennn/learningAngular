import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-weapon',
  templateUrl: './weapon.component.html',
  styleUrls: ['./weapon.component.scss'],
})
export class WeaponComponent implements OnInit {
  @Input() weaponName: string;
  @Input() recWeaponUrl: string;
  @Input() weaponDescription: string;
  @Input() weaponRarity: number;
  @Input() weaponUrl: string;

  constructor() {}

  ngOnInit(): void {}
}
