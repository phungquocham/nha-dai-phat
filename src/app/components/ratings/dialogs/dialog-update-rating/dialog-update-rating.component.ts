import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CONFIRM, TYPE_BASIC } from 'src/app/shared/helpers/const';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { REGEX } from 'src/app/shared/helpers/regex';

@Component({
  selector: 'app-dialog-update-rating',
  templateUrl: './dialog-update-rating.component.html',
  styleUrls: ['./dialog-update-rating.component.css']
})
export class DialogUpdateRatingComponent implements OnInit {

  selectedColor = '#3fb551';
  isNewType = false;
  form: FormGroup;
  hidePointsField = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogUpdateRatingComponent>,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      'name': [null, Validators.compose([Validators.required])],
      'points': [null, Validators.compose([Validators.required, Validators.pattern(REGEX.NUMBER_TYPE_FLOOR_POSITIVE)])]
    });
   }

  ngOnInit() {
    if (this.data) {
      this.form.controls['name'].setValue(this.data.name || '');
      this.form.controls['points'].setValue(this.data.points || 0);
      if (this.data.color) {
        this.selectedColor = this.data.color;
      }
      if (this.data.type === TYPE_BASIC.NEW) {
        this.isNewType = true;
      }
      this.hidePointsField = (this.data.hide && this.data.hide.points) || false;
    }
  }

  closeDialog(data = null) {
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
    this.dialogRef.close(data);
  }

  update() {
    const {name, points} = this.form.value;
    this.closeDialog({
      status: CONFIRM.OK,
      data: {
        color: this.selectedColor,
        name: name,
        points: points
      }
    });
  }

}
