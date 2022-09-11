import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ApiService, Character } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { ListTodosComponent } from '../list-todos/list-todos.component';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  productForm!: FormGroup;
  actionBtn = 'Save';
  dialogTitle = 'Create Character';
  chars: Character[] = [];
  dataSource = new MatTableDataSource();
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public updateCharacter: Character
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      element: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const body = {};
    console.log(this.updateCharacter);
    if (this.updateCharacter) {
      this.productForm.controls['name'].disable();
      this.actionBtn = 'Update';
      this.dialogTitle = 'Update Character';
      this.productForm.controls['name'].setValue(this.updateCharacter.name);
      this.productForm.controls['element'].setValue(
        this.updateCharacter.element
      );
    }
  }
  addCharacter() {
    this.api.postCharacter(this.productForm.getRawValue()).subscribe({
      next: (res) => {
        if (this.actionBtn != 'Save') {
          this.snackBar.open('Updated successfully !!!', '🤑🤑🤑', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.snackBar.open('Created successfully !!!', '🤑🤑🤑', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
        this.dialogRef.close();
      },
      error: () => {
        alert('Failed');
      },
    });
  }
}
