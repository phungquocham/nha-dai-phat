import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Utils } from 'src/app/shared/helpers/utilities';
import { filterData } from '../rating-reports.model';
import { CustomSelectAutocompleteComponent } from 'src/app/shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.component';

@Component({
  selector: 'app-dialog-rating-reports-search',
  templateUrl: './dialog-rating-reports-search.component.html',
  styleUrls: ['./dialog-rating-reports-search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogRatingReportsSearchComponent
  implements OnInit, AfterViewInit {
  fromDate = new Date();
  toDate = new Date();
  filterData = { ...filterData };
  teamSelected = [];
  teamList = [];
  usersSelected = [];
  usersList = [];
  @ViewChild('selectTeams') selectTeams: CustomSelectAutocompleteComponent;
  @ViewChild('selectUsers') selectUsers: CustomSelectAutocompleteComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogRatingReportsSearchComponent>,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.data) {
      this.teamList = this.data.teamList;
      this.usersList = this.data.usersList;
      this.fromDate = this.data.fromDate;
      this.toDate = this.data.toDate;
      this.teamSelected = this.data.teamSelected;
      this.usersSelected = this.data.usersSelected;
      //
      this.selectTeams.setData(this.teamList);
      this.selectTeams.setSelectedDataBaseOnValue(this.teamSelected);
      //
      this.selectUsers.setData(this.usersList);
      this.selectUsers.setSelectedDataBaseOnValue(this.usersSelected);
    }
  }

  search() {
    this.filterData.fromDate = Utils.convertDateString(this.fromDate);
    this.filterData.toDate = Utils.convertDateString(this.toDate);
    this.filterData.teamIds = this.teamSelected
      .map((i) => Number(i))
      .filter((i) => i)
      .join(',');
    this.filterData.userIds = this.usersSelected
      .map((i) => Number(i))
      .filter((i) => i)
      .join(',');
    this.closeDialog({ search: this.filterData });
  }

  onAddDailyReport() {
    this.closeDialog({ add: true });
  }

  closeDialog(data = null) {
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
    this.dialogRef.close(data);
  }
  getSelectedTeams(selected) {
    this.teamSelected = selected;
  }
  getSelectedusers(selected) {
    this.usersSelected = selected;
  }
}
