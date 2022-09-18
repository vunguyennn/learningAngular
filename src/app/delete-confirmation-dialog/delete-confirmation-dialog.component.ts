import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Character } from '@pendo/services';

export interface DialogInput {
  character: Character;
  message: string;
}

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.scss'],
})
export class DeleteConfirmationDialogComponent implements OnInit {
  constructor(
    public dialog: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogInput
  ) {}

  ngOnInit(): void {}

  confirm() {
    this.dialog.close(true);
  }
}
