import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import {
  ApiService,
  Character,
  Element,
  UploadImageReq,
  WeaponType,
} from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { delay, finalize, tap } from 'rxjs/operators';
import { defer, firstValueFrom } from 'rxjs';
import { HomeComponent } from '../home/home.component';
import { ThisReceiver } from '@angular/compiler';

export interface DialogInput {
  character: Character;
  elements: Element[];
  weaponTypes: WeaponType[];
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  @ViewChild('createImg') createImg!: HTMLImageElement;

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
  previewImg: string = '';

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
      weaponType: ['', Validators.required],
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
      this.productForm.patchValue({
        // id: id
        id,
        name,
        element: element,
        weaponType: weapon,
        imgUrl,
      });
      console.log(this.productForm.value);
    }
  }

  async save() {
    this.loading = true;
    // const formValue = this.productForm.getRawValue();
    // has to call formValue.id, formValue.name, ...
    //* -> use destructuring:
    const { id, name, element, weaponType, imgUrl } =
      this.productForm.getRawValue();

    //! this.productForm.getRawValue():
    //! id
    //! name
    //! element
    //! weaponType -> interface's field is weapon -> has to map name
    //! imgUrl
    //* Character:
    //* id
    //* name
    //* element
    //* weapon
    //* imgUrl
    //! Solution 1: rename form control from weaponType -> weapon
    //! Solution 2: create new character data in this function (recommend)
    const character: Character = {
      // if key === value
      // id: id => id
      id: id,
      name, // name: name,
      element: element,
      weapon: weaponType,
      imgUrl: imgUrl,
    };

    // if previewImg is existed => upload new image
    if (
      this.previewImg &&
      this.uploadImageData?.blob &&
      this.uploadImageData?.name
    ) {
      const res: any = await firstValueFrom(
        this.api.uploadImage(this.uploadImageData)
      );
      character.imgUrl = res.imgUrl;
    }

    // if has character passed from home => edit
    // defer === if (but more pro :'( )
    defer(() => {
      return this.data.character
        ? // if (this.data.character) => this.api.updateCharacter(character)
          // else{ this.api.postCharacter(character);}
          this.api.updateCharacter(character)
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
    // event.target.files = read file
    const file: File = event.target.files[0];
    const reader = new FileReader();
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/loadend_event
    reader.onloadend = (e: any) => {
      this.previewImg = URL.createObjectURL(file);

      const blob = e.target.result;
      this.uploadImageData = {
        blob,
        name: file.name,
      };
    };
    // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsBinaryString
    reader.readAsBinaryString(file);
  }
}
