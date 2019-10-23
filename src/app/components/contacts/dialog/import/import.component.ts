import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactsService } from 'src/app/shared/services/api/contacts.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from 'src/app/shared/services/others/snackbar.service';

@Component({
  selector: 'app-dialog-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  providers: [ContactsService]
})
export class DialogImportComponent implements OnInit {
  form: FormGroup;
  addData = new FormData();
  file: File;
  valid = true;
  ngUnsubscribe = new Subject();
  isUploadingFile = false;
  @ViewChild('inputSelect', {static: false}) inputSelect: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogImportComponent>,
    private fb: FormBuilder,
    private contactsService: ContactsService,
    private snackbar: SnackbarService
  ) {
    this.form = this.fb.group({
      source: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.isValid();
    if (this.valid && this.form.valid) {
      this.isUploadingFile = true;
      this.setData();
      this.contactsService.import(this.addData).pipe(takeUntil(this.ngUnsubscribe)).subscribe(_ => {
        this.isUploadingFile = false;
        this.closeDialog();
      });
    }
  }

  uploadFile(e) {
    this.file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    this.isValid();
    console.log(this.file);
  }

  isValid() {
    const shadesEl = document.querySelector('.inf__drop-area');
    if (this.file && this.file.name) {
      this.valid = true;
      shadesEl.classList.remove('border-error');
    } else {
      this.valid = false;
      shadesEl.classList.add('border-error');
    }
  }

  setData() {
    this.addData = new FormData();
    this.addData.append('Source', this.form.controls['source'].value);
    this.addData.append('File', this.file);
  }

  closeDialog(data = null) {
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
    this.dialogRef.close(data);
  }
}
