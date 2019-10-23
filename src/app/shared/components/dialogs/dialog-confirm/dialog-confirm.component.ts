import {
  Component,
  ViewEncapsulation,
  Optional,
  ChangeDetectionStrategy,
  AfterViewInit,
  ChangeDetectorRef,
  Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONFIRM } from 'src/app/shared/helpers/const';



@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})

export class DialogConfirmComponent {

  constructor(
    @Optional() private dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ok() {
    this.closeDialog(CONFIRM.OK);
  }

  cancel() {
    this.closeDialog(CONFIRM.CANCEL);
  }

  closeDialog(data = null) {
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
    this.dialogRef.close(data);
  }

}
