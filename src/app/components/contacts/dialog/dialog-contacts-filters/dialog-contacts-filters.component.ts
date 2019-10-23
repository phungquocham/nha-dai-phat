import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ContactsFiltersComponent } from '../../contacts-filters/contacts-filters.component';
import { BUTTON } from 'src/app/shared/helpers/const';


@Component({
  selector: 'app-dialog-contacts-filters',
  templateUrl: './dialog-contacts-filters.component.html',
  styleUrls: ['./dialog-contacts-filters.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialogContactsFiltersComponent implements OnInit, AfterViewInit {
  @ViewChild('contactsFiltersElement', {static: false}) contactsFiltersElement: ContactsFiltersComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IData,
    private dialogRef: MatDialogRef<DialogContactsFiltersComponent>
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.contactsFiltersElement.setContactSourcesList(this.data.contactSourcesList);
      this.contactsFiltersElement.setUsersList(this.data.usersList);
      this.contactsFiltersElement.setContactResultsList(this.data.contactResultsList);
      this.contactsFiltersElement.setTeamsList(this.data.teamsList);
    }, 0);
  }

  emitQuery() {
    this.closeDialog({
      status: BUTTON.OK,
      query: this.contactsFiltersElement.getHandledQueryParams()
    });
  }

  closeDialog(data = null) {
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
    this.dialogRef.close(data);
  }
}

interface IData {
  contactSourcesList: any;
  usersList: any;
  contactResultsList: any;
  teamsList: any;
}


