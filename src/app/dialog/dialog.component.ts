import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import {
  ApiService,
  Character,
  Element,
  UploadImageReq,
  Weapon,
} from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { finalize, tap } from 'rxjs/operators';
import { defer, firstValueFrom } from 'rxjs';

export interface DialogInput {
  character: Character;
  elements: Element[];
  weapons: Weapon[];
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
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
  event!: { target: { files: any } };
  uploadImageData: Partial<UploadImageReq> = {};
  url: UploadImageReq[] = [];
  // url = '/assets/cat.jpg';

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
      weapon: ['', Validators.required],
      imgUrl: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const body = {};
    if (this.data.character) {
      const { id, name, element, weapon, imgUrl } = this.data.character;
      // Use this to make field read-only
      // this.productForm.controls['name'].disable();
      this.actionBtn = 'Update';
      this.dialogTitle = 'Edit Character';

      // this.productForm.controls['id'].setValue(this.updateCharacter.id);
      // this.productForm.controls['name'].setValue(this.updateCharacter.name);
      // this.productForm.controls['element'].setValue(
      //   this.updateCharacter.element
      // );
      this.productForm.patchValue({ id, name, element, weapon, imgUrl });
      console.log(this.productForm.value);
    }
  }

  async save() {
    this.loading = true;
    const character: Character = this.productForm.getRawValue();

    if (this.uploadImageData?.blob && this.uploadImageData?.name) {
      const res: any = await firstValueFrom(
        this.api.uploadImage(this.uploadImageData)
      );
      character.imgUrl = res.imgUrl;
    }

    if (this.uploadImageData.blob)
      defer(() => {
        return this.data.character
          ? this.api.updateCharacter(character)
          : this.api.postCharacter(character);
      })
        .pipe(
          finalize(() => (this.loading = false)),
          tap((res) => {
            console.log('😎 ~ res', res);
            this.snackBar.open(
              `${this.data.character ? 'Updated' : 'Created'} successfully !!!`,
              '🤑🤑🤑',
              {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              }
            );
            this.dialogRef.close(res);
          })
        )
        .subscribe();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    const reader2 = new FileReader();
    reader2.readAsDataURL(event.target.files[0]);

    reader2.onload = (event: any) => {
      this.url = event.target.result;
    };
    reader.onload = () => {
      const blob = reader.result as string;
      this.uploadImageData = {
        blob,
        name: file.name,
      };
    };

    reader.readAsBinaryString(file);
  }
}
