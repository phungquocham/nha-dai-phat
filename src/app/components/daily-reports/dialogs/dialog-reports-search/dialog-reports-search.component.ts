import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Utils } from 'src/app/shared/helpers/utilities';
import { filterData } from '../../daily-reports.model';
import { UserProfile } from 'src/app/shared/models/user.profile.namespace';
import { CustomSelectAutocompleteComponent } from 'src/app/shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.component';

@Component({
  selector: 'app-dialog-reports-search',
  templateUrl: './dialog-reports-search.component.html',
  styleUrls: ['./dialog-reports-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogReportsSearchComponent implements OnInit, AfterViewInit {
  fromDate = new Date();
  toDate = new Date();
  filterData = { ...filterData };
  teamSelected = [];
  teamList = [];
  usersSelected = [];
  usersList = [];
  sourcesSelected = [];
  sourcesList = [];
  permission = UserProfile.getRole();
  @ViewChild('selectTeams') selectTeams: CustomSelectAutocompleteComponent;
  @ViewChild('selectUsers') selectUsers: CustomSelectAutocompleteComponent;
  @ViewChild('selectSources') selectSources: CustomSelectAutocompleteComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogReportsSearchComponent>,
    private ref: ChangeDetectorRef
  ) {}
  ngOnInit() {}

  ngAfterViewInit() {
    if (this.data) {
      this.teamList = this.data.teamList;
      this.usersList = this.data.usersList;
      this.sourcesList = this.data.sourcesList;
      this.fromDate = this.data.fromDate;
      this.toDate = this.data.toDate;
      this.teamSelected = this.data.teamSelected;
      this.usersSelected = this.data.usersSelected;
      this.sourcesSelected = this.data.sourcesSelected;
      //
      this.selectTeams.setData(this.teamList);
      this.selectTeams.setSelectedDataBaseOnValue(this.teamSelected);
      //
      this.selectUsers.setData(this.usersList);
      this.selectUsers.setSelectedDataBaseOnValue(this.usersSelected);
      //
      this.selectSources.setData(this.sourcesList);
      this.selectSources.setSelectedDataBaseOnValue(this.sourcesSelected);
    }
    this.ref.detectChanges();
  }

  search() {
    this.filterData.fromDate = Utils.convertDateString(this.fromDate);
    this.filterData.toDate = Utils.convertDateString(this.toDate);
    this.filterData.teams = this.teamSelected
      .map((i) => Number(i))
      .filter((i) => i)
      .join(',');
    this.filterData.users = this.usersSelected
      .map((i) => Number(i))
      .filter((i) => i)
      .join(',');
    this.filterData.sources = this.sourcesSelected
      .map((i) => Number(i))
      .filter((i) => i)
      .join(',');
    this.closeDialog({
      search: this.filterData,
    });
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
  getSelectedSources(selected) {
    this.sourcesSelected = selected;
  }
}
