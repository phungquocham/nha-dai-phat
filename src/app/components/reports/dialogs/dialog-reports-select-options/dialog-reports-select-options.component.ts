import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Utils } from 'src/app/shared/helpers/utilities';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomSelectAutocompleteComponent } from 'src/app/shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.component';

@Component({
  selector: 'app-dialog-reports-select-options',
  templateUrl: './dialog-reports-select-options.component.html',
  styleUrls: ['./dialog-reports-select-options.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogReportsSelectOptionsComponent
  implements OnInit, AfterViewInit {
  @ViewChild('startPicker') startPicker: MatDatepicker<Date>;

  @ViewChild('selectTeamsElement')
  selectTeamsElement: CustomSelectAutocompleteComponent;
  @ViewChild('selectUsersElement')
  selectUsersElement: CustomSelectAutocompleteComponent;
  @ViewChild('selectSourcesElement')
  selectSourcesElement: CustomSelectAutocompleteComponent;
  @ViewChild('selectProjectsElement')
  selectProjectsElement: CustomSelectAutocompleteComponent;

  private date = new Date();
  private year = this.date.getFullYear();
  private month = this.date.getMonth();
  private dateStartMonth = new Date(this.year, this.month, 1);
  private dateEndMonth = new Date(this.year, this.month + 1, 0);
  projectsSelected = [];
  projectsList = [];
  teamsSelected = [];
  teamsList = [];
  usersSelected = [];
  usersList = [];
  sourcesColumnsList = [];
  sourcesColumnsSelected = [];
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogReportsSelectOptionsComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      startDate: [this.dateStartMonth],
      endDate: [this.dateEndMonth],
    });
  }

  ngOnInit() {
    console.log(this.data);
    console.log(this.form.value);
    if (this.data) {
      if (this.data.projectsList) {
        this.projectsList = this.data.projectsList;
      }
      if (this.data.teamsList) {
        this.teamsList = this.data.teamsList;
      }
      if (this.data.usersList) {
        this.usersList = this.data.usersList;
      }
      if (this.data.sourcesColumnsList) {
        this.sourcesColumnsList = this.data.sourcesColumnsList;
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.selectTeamsElement.setData(this.teamsList);
      this.selectUsersElement.setData(this.usersList);
      this.selectSourcesElement.setData(this.sourcesColumnsList);
      this.selectProjectsElement.setData(this.projectsList);
    }, 0);
  }

  getSelectedTeams(selected) {
    this.teamsSelected = selected;
  }

  getSelectedUsers(selected) {
    this.usersSelected = selected;
  }

  getSelectedSources(selected) {
    this.sourcesColumnsSelected = selected;
  }

  getSelectedProjects(selected) {
    this.projectsSelected = selected;
  }

  getReports() {
    let { startDate, endDate } = this.form.value;
    if (!(startDate instanceof Date)) {
      // instanceof Moment
      startDate = startDate._d;
    }
    if (!(endDate instanceof Date)) {
      // instanceof Moment
      endDate = endDate._d;
    }
    startDate = Utils.DateTime.convertDateStringDDMMYYYY(startDate);
    endDate = Utils.DateTime.convertDateStringDDMMYYYY(endDate);
    const data = {
      startDate,
      endDate,
      projectsSelected: this.projectsSelected,
      teamsSelected: this.teamsSelected,
      usersSelected: this.usersSelected,
      sourcesColumnsSelected: this.sourcesColumnsSelected,
    };
    this.closeDialog(data);
  }

  closeDialog(data = null) {
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
    this.dialogRef.close(data);
  }

  exportReports() {
    this.closeDialog({
      export: true,
    });
  }
}
