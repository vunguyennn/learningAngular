import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
  errorMessage = 'An error has occured! Please contact the Admin.';

  constructor() {}

  ngOnInit(): void {}
}
