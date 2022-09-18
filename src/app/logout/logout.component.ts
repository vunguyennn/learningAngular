import { Component, OnInit } from '@angular/core';
import { HardcodedAuthenticationService } from '@pendo/services';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(
    public hardcodedAuthenticationService: HardcodedAuthenticationService
  ) {}

  ngOnInit(): void {
    this.hardcodedAuthenticationService.logout();
  }
}
