import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Utils } from 'src/app/shared/helpers/utilities';
import { filterData } from '../telesales-reports.model';

@Component({
  selector: 'app-dialog-telesales-reports',
  templateUrl: './dialog-telesales-reports.component.html',
  styleUrls: ['./dialog-telesales-reports.component.css']
})
export class DialogTelesalesReportsComponent implements OnInit {
  fromDate = new Date();
  toDate = new Date();
  filterData = { ...filterData };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogTelesalesReportsComponent>
  ) {
  }

  ngOnInit() {
    if (this.data) {
      this.fromDate = this.data.fromDate;
      this.toDate = this.data.toDate;
    }
  }

  search() {
    this.filterData.fromDate = Utils.convertDateString(this.fromDate);
    this.filterData.toDate = Utils.convertDateString(this.toDate);
    this.closeDialog({ search: this.filterData });
  }

  closeDialog(data = null) {
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
    this.dialogRef.close(data);
  }
}
