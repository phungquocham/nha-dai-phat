import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { REGEX } from 'src/app/shared/helpers/regex';
import {
  ModelUserCreate,
  ModelUserInList,
} from 'src/app/shared/models/users.model';
import { TeamsService } from 'src/app/shared/services/api/teams.service';
import { ROLE } from 'src/app/shared/helpers/const';
import { Utils } from 'src/app/shared/helpers/utilities';

@Component({
  selector: 'app-dialog-edit-user',
  templateUrl: './dialog-edit-user.component.html',
  styleUrls: ['./dialog-edit-user.component.css'],
})
export class DialogEditUserComponent implements OnInit {
  private userId = 0;

  form: FormGroup;
  teamsList = [];
  isNewType = false;
  ROLE = ROLE;
  rolesList = [ROLE.ADMINISTRATOR, ROLE.MANAGER, ROLE.SALES, ROLE.GUEST];
  joinedDate = new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModelUserInList,
    private dialogRef: MatDialogRef<DialogEditUserComponent>,
    private fb: FormBuilder,
    private teamsService: TeamsService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      phone: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(REGEX.PHONE),
        ]),
      ],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(REGEX.EMAIL),
        ]),
      ],
      role: [ROLE.GUEST, Validators.compose([Validators.required])],
      teamId: [null],
      joinedDate: [new Date(), Validators.required],
    });
  }

  ngOnInit() {
    this.form.get('role').valueChanges.subscribe((name) => {
      if (name === ROLE.SALES) {
        if (!this.form.value['teamId']) {
          this.form.controls['teamId'].setValue(this.teamsList[0].id);
        }
      }
    });
    if (this.isComponentCreateNew()) {
      this.isNewType = true;
    }
    this.getTeamsList();
  }

  changeJoinDate() {
    this.form.controls['joinedDate'].setValue(this.joinedDate);
  }

  private isComponentCreateNew() {
    return this.data['type'] === 'NEW';
  }

  closeDialog(data = null) {
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
    this.dialogRef.close(data);
  }

  private detectChanges() {
    this.cdr.detectChanges();
  }

  private getTeamsList() {
    this.teamsService.getList().subscribe((res) => {
      this.teamsList = res;
      this.detectChanges();
      this.getDataToForm();
    });
  }

  private getDataToForm() {
    this.userId = this.data.id;
    this.form.controls['firstName'].setValue(this.data.firstName);
    this.form.controls['lastName'].setValue(this.data.lastName);
    this.form.controls['role'].setValue(this.data.role);
    this.form.controls['teamId'].setValue(this.data.teamId);
    this.form.controls['phone'].setValue(this.data.phone);
    this.form.controls['email'].setValue(this.data.email);
    if (this.isComponentCreateNew()) {
      this.form.controls['role'].setValue(this.rolesList[3]);
      this.form.controls['teamId'].setValue(this.teamsList[0].id);
    }
    if (this.data.role === ROLE.ADMINISTRATOR) {
      this.form.controls['role'].disable();
    }
  }

  updateUser() {
    this.form.controls['joinedDate'].setValue(
      Utils.DateTime.convertDateStringDDMMYYYY(
        this.form.controls['joinedDate'].value
      )
    );
    const formatedPhone = Utils.ConvertPhoneNumberWithVietNamePhoneCode(
      this.form.controls['phone'].value
    );
    const data = {
      firstName: this.form.value['firstName'],
      lastName: this.form.value['lastName'],
      phone: formatedPhone,
      email: this.form.value['email'],
    };
    if (this.data.role === ROLE.ADMINISTRATOR) {
      data['role'] = ROLE.ADMINISTRATOR;
    } else {
      data['role'] = this.form.value['role'];
    }
    if (this.form.value['role'] === ROLE.SALES) {
      data['teamId'] = this.form.value['teamId'];
    }
    if (this.isNewType) {
      data['joinedDate'] = this.form.value['joinedDate'];
      this.closeDialog(data);
    } else {
      this.closeDialog({ id: this.userId, data: data });
    }
  }
}
