import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CapitalizeCasePipe } from '@pendo/pipes';
import {
  Character,
  CharacterService,
  Element,
  ElementService,
  UploadImageReq,
  WeaponType,
  WeaponTypeService,
} from '@pendo/services';
import { defer, firstValueFrom, Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, OnDestroy {
  @ViewChild('createImg') createImg!: HTMLImageElement;

  productForm!: FormGroup;
  actionBtn = 'Add';
  dialogTitle = 'Add Character';
  dataSource = new MatTableDataSource();
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  loading = false;
  event!: { target: { files: any } };
  uploadImageData: Partial<UploadImageReq> = {};
  previewImg: string = '';
  // elements: Element[] = [];
  // weaponTypes: WeaponType[] = []; => change to use async pipe
  // character: Character;

  destroy$ = new Subject();
  // create an observable property
  weaponTypes$: Observable<WeaponType[]>;
  elements$: Observable<Element[]>;
  activeCharacter$: Observable<Character>;
  activeCharacter: Character;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponent>,
    private snackBar: MatSnackBar,
    private characterService: CharacterService,
    private elementService: ElementService,
    private weaponTypeService: WeaponTypeService,
    // use pipe
    private capitalizeCasePipe: CapitalizeCasePipe
  ) {
    this.productForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      element: ['', Validators.required],
      weaponType: ['', Validators.required],
      imgUrl: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    //* When destroy => set active character to null
    this.characterService.setActiveCharacter(null);
    // When the component destroy => trigger this subject
    // On any observable, check if this subject is triggered => unsubscribe
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    // get active character => if activeCharacter !== null => update, else create
    this.characterService.activeCharacter$$
      .pipe(
        takeUntil(this.destroy$),
        tap((activeCharacter) => {
          this.activeCharacter = activeCharacter;
          console.log('😎 ~ activeCharacter', activeCharacter);
        })
      )
      .subscribe();

    // elements from store
    // this.elementService.elements$$
    //   .pipe(
    //     //* `takeUntil` subscribes and begins mirroring the source Observable. It also
    //     //* monitors a second Observable, `notifier` that you provide. If the `notifier`
    //     //* emits a value, the output Observable stops mirroring the source Observable
    //     //* and completes
    //     takeUntil(this.destroy$),
    //     tap((elements) => {
    //       this.elements = elements;
    //     })
    //   )
    //   .subscribe();
    this.elements$ = this.elementService.elements$$;
    console.log('😎 ~ this.elements$', this.elements$);

    // this.weaponTypeService.weaponTypes$$
    //   .pipe(
    //     takeUntil(this.destroy$),
    //     tap((weaponTypes) => {
    //       this.weaponTypes = weaponTypes;
    //     })
    //   )
    //   .subscribe();
    this.weaponTypes$ = this.weaponTypeService.weaponTypes$$; // use async pipe
    console.log('😎 ~ this.weaponTypes$', this.weaponTypes$);

    const body = {};
    if (this.activeCharacter) {
      const { id, name, element, weapon, imgUrl } = this.activeCharacter;
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
        name: this.capitalizeCasePipe.transform(name),
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
    const { id, name, element, weaponType, imgUrl, elementUrl } =
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
      elementUrl: elementUrl,
    };

    // if previewImg is existed => upload new image
    if (
      this.previewImg &&
      this.uploadImageData?.blob &&
      this.uploadImageData?.name
    ) {
      const res: any = await firstValueFrom(
        this.characterService.uploadImage(this.uploadImageData)
      );
      character.imgUrl = res.imgUrl;
    }

    // if has character passed from home => edit
    // defer === if (but more pro :'( )
    defer(() => {
      return this.activeCharacter
        ? // if (this.data.character) => this.api.updateCharacter(character)
          // else{ this.api.postCharacter(character);}
          this.characterService.updateCharacter(character)
        : this.characterService.postCharacter(character);
    })
      .pipe(
        finalize(() => (this.loading = false)),
        tap((_) => {
          this.snackBar.open(
            `${this.activeCharacter ? 'Updated' : 'Created'} successfully !!!`,
            '🤑🤑🤑',
            {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            }
          );
          this.dialogRef.close(true);
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
