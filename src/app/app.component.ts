import { Component, OnInit } from '@angular/core';
// This import path is too long => use short import
// import { HardcodedAuthenticationService } from '../services/hardcoded-authentication.service';
import {
  CharacterService,
  ElementService,
  HardcodedAuthenticationService,
  WeaponTypeService,
} from '@pendo/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // template: '<h1>{{name}}</h1>',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private hardcodedAuthenticationService: HardcodedAuthenticationService,
    private characterService: CharacterService,
    private elementService: ElementService,
    private weaponTypeService: WeaponTypeService
  ) {}

  // App component will load first => call api one time here
  ngOnInit() {
    if (!this.hardcodedAuthenticationService.loggedIn$) {
      this.hardcodedAuthenticationService.isUserLoggedIn();
      // if (this.hardcodedAuthenticationService.loggedIn$) {
      //   this.characterService.getCharacters().subscribe();
      //   this.elementService.getElements().subscribe();
      //   this.weaponTypeService.getWeaponType().subscribe();
      // }
    }
  }
}
