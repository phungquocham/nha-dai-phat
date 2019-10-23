import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Utils } from 'src/app/shared/helpers/utilities';

@Component({
  selector: 'app-dialog-reports-select-datetime',
  templateUrl: './dialog-reports-select-datetime.component.html',
  styleUrls: ['./dialog-reports-select-datetime.component.css']
})
export class DialogReportsSelectDatetimeComponent implements OnInit {

  selectedDate: any;
  startDate = Utils.DateTime.getTodayInVN();
  endDate = Utils.DateTime.getTodayInVN();
  isStartDateTurn = true;

  constructor(
    private dialogRef: MatDialogRef<DialogReportsSelectDatetimeComponent>,
  ) { }

  ngOnInit() {
  }

  closeDialog(data = null) {
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
    this.dialogRef.close(data);
  }

  onSelect(event) {
    this.selectedDate = event;
    if (this.isStartDateTurn) {
      this.isStartDateTurn = false;
      this.startDate = Utils.DateTime.getDatetimeInVN(this.selectedDate);
    } else {
      this.isStartDateTurn = true;
      this.endDate = Utils.DateTime.getDatetimeInVN(this.selectedDate);
    }
    // this.endDate = Utils.DateTime.getDatetimeInVN(this.selectedDate);
    // this.startDate = this.endDate;
    console.log(this.selectedDate);
  }

}
