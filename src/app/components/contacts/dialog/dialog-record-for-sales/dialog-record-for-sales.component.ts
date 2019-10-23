import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


import { Utils } from 'src/app/shared/helpers/utilities';
import { ProjectsService } from 'src/app/shared/services/api/projects.service';
import { ContactsService } from 'src/app/shared/services/api/contacts.service';
import { SnackbarService } from 'src/app/shared/services/others/snackbar.service';
import { BUTTON } from 'src/app/shared/helpers/const';

@Component({
  selector: 'app-dialog-record-for-sales',
  templateUrl: './dialog-record-for-sales.component.html',
  styleUrls: ['./dialog-record-for-sales.component.css']
})
export class DialogRecordForSalesComponent implements OnInit, AfterViewInit {

  userInfo = new UserInfo();
  projectsList = [];

  private contactId = 0;

  constructor(
    private dialogRef: MatDialogRef<DialogRecordForSalesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private projectsService: ProjectsService,
    private contactsService: ContactsService,
    private snackbar: SnackbarService
  ) { }

  ngOnInit() {
    console.log(this.data.userInfo);
    this.contactId = this.data.contactId;
    if (this.data.userInfo) {
      this.userInfo.setData(this.data.userInfo);
    }
  }

  ngAfterViewInit() {
    this.projectsService.getList().subscribe(res => {
      this.projectsList = res;
    });
  }

  onChangeContactResult(value) {
    if (this.userInfo.contactResultId !== 9 && this.userInfo.contactResultId !== 10) {
      this.userInfo.interestedProjectId = 0;
    }
  }

  onChangeInterestedProject(value) {
    console.log(value);
  }

  update() {
    const data = {};
    data['contactResultId'] = this.userInfo.contactResultId;
    data['assignedDate'] = this.userInfo.assignedDate;
    data['assignedUserId'] = this.userInfo.assignedUserId;
    if (this.userInfo.email) {
      data['email'] = this.userInfo.email;
    }
    if (this.userInfo.zalo) {
      data['zalo'] = this.userInfo.zalo;
    }
    if (this.userInfo.facebook) {
      data['facebook'] = this.userInfo.facebook;
    }
    if (this.userInfo.note) {
      data['note'] = this.userInfo.note;
    }
    if (this.userInfo.contactResultId === 9) { // F1
      data['interestedProjectId'] = this.userInfo.interestedProjectId;
    }
    if (this.userInfo.contactResultId === 10) { // F1A
      data['interestedProjectId'] = this.userInfo.interestedProjectId;
      data['appointmentDate'] = Utils.DateTime.convertDateStringDDMMYYYY(this.userInfo.appointmentDate);
    }
    this.contactsService.updateAnAssignment({
      contactId: this.contactId,
      newData: data,
      assignedDate: this.userInfo.assignedDate,
      assignedUserId: this.userInfo.assignedUserId
    }).subscribe(_ => {
      this.snackbar.open({ message: 'Cập nhật thành công!', type: 'SUCCESS' });
      this.closeDialog(BUTTON.OK);
    });
  }

  closeDialog(data = null) {
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
    this.dialogRef.close(data);
  }

}

interface IDialogData {
  contactId?: number;
  userInfo?: IUserInfo;
  projectsList?: any[];
  contactResultsList?: any[];
}

interface IUserInfo {
  assignedDate: number;
  assignedDateString: string;
  assignedUserId: number;
  assignedUserName: string;
  contactResultId: number;
  interestedProjectId: number;
  appointmentDate: any;
  email: string;
  facebook: string;
  zalo: string;
  note: string;
}

class UserInfo implements IUserInfo {
  assignedDate;
  assignedDateString;
  assignedUserId = 0;
  assignedUserName = '';
  contactResultId = 0;
  interestedProjectId = 0;
  appointmentDate = new Date();
  email = '';
  facebook = '';
  zalo = '';
  note = '';
  constructor() {}
  setData(data: IUserInfo) {
    this.assignedUserName = data.assignedUserName;
    this.email = data.email;
    this.zalo = data.zalo;
    this.facebook = data.facebook;
    this.note = data.note;
    this.contactResultId = data.contactResultId;
    this.assignedDate = data.assignedDate;
    this.interestedProjectId = data.interestedProjectId;
    this.assignedUserId = data.assignedUserId;
    // if (data.appointmentDate) {
    //   this.appointmentDate = Utils.DateTime.convertDateTimeToDateInVN(data.appointmentDate);
    // } else {
    //   this.appointmentDate = new Date();
    // }
  }

}
