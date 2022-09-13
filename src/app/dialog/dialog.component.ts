import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ApiService, Character, Element } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

export interface DialogInput {
  character: Character;
  elements: Element[];
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  productForm!: FormGroup;
  actionBtn = 'Add';
  dialogTitle = 'Add Character';
  chars: Character[] = [];
  dataSource = new MatTableDataSource();
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogInput
  ) {
    this.productForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      element: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const body = {};
    console.log('😎 ~ this.updateCharacter', this.data);
    if (this.data.character) {
      const { id, name, element } = this.data.character;
      // Use this to make field read-only
      // this.productForm.controls['name'].disable();
      this.actionBtn = 'Update';
      this.dialogTitle = 'Edit Character';

      // this.productForm.controls['id'].setValue(this.updateCharacter.id);
      // this.productForm.controls['name'].setValue(this.updateCharacter.name);
      // this.productForm.controls['element'].setValue(
      //   this.updateCharacter.element
      // );
      this.productForm.patchValue({ id, name, element });
    }
  }

  addCharacter() {
    this.loading = true;

    this.api
      .postCharacter(this.productForm.getRawValue())
      .pipe(
        finalize(() => (this.loading = false)),
        tap((res) => {
          this.snackBar.open(`Created successfully !!!`, '🤑🤑🤑', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });

          this.dialogRef.close();
        })
      )
      .subscribe();
  }

  updateCharacterDialog() {
    this.loading = true;

    this.api
      .updateCharacter(this.productForm.getRawValue())
      .pipe(
        finalize(() => (this.loading = false)),
        tap((res) => {
          this.snackBar.open(`Updated successfully !!!`, '🤑🤑🤑', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.dialogRef.close();
        })
      )
      .subscribe();
  }

  clickDialog() {
    if (this.data.character) {
      this.updateCharacterDialog();
    } else {
      this.addCharacter();
    }
  }
}
