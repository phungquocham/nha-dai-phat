import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Optional,
  Inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONFIRM, TYPE_BASIC } from 'src/app/shared/helpers/const';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-update-name',
  templateUrl: './dialog-update-name.component.html',
  styleUrls: ['./dialog-update-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DialogUpdateNameComponent implements OnInit {
  form: FormGroup;
  newName = '';
  isNewType = false;

  constructor(
    @Optional() private dialogRef: MatDialogRef<DialogUpdateNameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const name = (this.data && this.data.name) || null;
    this.form = this.fb.group({
      name: [name, Validators.compose([Validators.required])],
    });
    if (this.data && this.data.type && this.data.type === TYPE_BASIC.NEW) {
      this.isNewType = true;
    }
  }

  update() {
    const temp: string = this.form.value['name'];
    if (!temp || temp.trim() === '') {
      return;
    }
    this.closeDialog({
      status: CONFIRM.OK,
      data: this.form.value['name'],
    });
  }

  cancel() {
    this.closeDialog({
      status: CONFIRM.CANCEL,
    });
  }

  closeDialog(data: any) {
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
    this.dialogRef.close(data);
  }
}
