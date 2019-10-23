import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContactSourceService} from 'src/app/shared/services/api/contact-sources.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SnackbarService} from 'src/app/shared/services/others/snackbar.service';

@Component({
  selector: 'app-dialog-contact-sources-edit',
  templateUrl: './contact-sources-edit.component.html',
  providers: [ContactSourceService]
})
export class ContactSourceEditComponent implements OnInit {
  form: FormGroup;
  ngUnsubscribe = new Subject();

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialogRef: MatDialogRef<ContactSourceEditComponent>,
      private fb: FormBuilder,
      private contactSourceService: ContactSourceService,
      private snackbar: SnackbarService
  ) {
    this.form = this.fb.group({
      source: ['', Validators.compose([Validators.required])]
    });

  }

  ngOnInit() {
    this.form.controls['source'].setValue(this.data.name);
  }

  onSubmit() {
    if (this.form.valid) {
      const data = {
        name: this.form.controls['source'].value
      };
      this.contactSourceService.update(this.data.id, data).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
        this.snackbar.open({message: 'Cập nhật thành công!', type: 'SUCCESS'});
        this.closeDialog({edit: true});
      });
    }
  }

  closeDialog(data = null) {
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
    this.dialogRef.close(data);
  }
}
