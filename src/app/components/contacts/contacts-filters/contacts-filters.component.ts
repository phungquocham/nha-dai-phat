import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';



import { CustomSelectAutocompleteComponent } from 'src/app/shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.component';
import { ContactSourceService } from 'src/app/shared/services/api/contact-sources.service';
import { UsersService } from 'src/app/shared/services/api/users.service';
import { ContactResultsService } from 'src/app/shared/services/api/contact-results.service';
import { Utils } from 'src/app/shared/helpers/utilities';
import { Routing } from 'src/app/shared/helpers/routing';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/shared/models/user.profile.namespace';
import { ROLE } from 'src/app/shared/helpers/const';

@Component({
  selector: 'app-contacts-filters',
  templateUrl: './contacts-filters.component.html',
  styleUrls: ['./contacts-filters.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ContactsFiltersComponent implements OnInit, AfterViewInit {

  @Input() autoHideOnPhone = true;

  @ViewChild('selectContactsElement', {static: false}) selectContactsElement: CustomSelectAutocompleteComponent;
  @ViewChild('selectUsersElement', {static: false}) selectUsersElement: CustomSelectAutocompleteComponent;
  @ViewChild('selectTeamsElement', {static: false}) selectTeamsElement: CustomSelectAutocompleteComponent;
  @ViewChild('selectContactResultsElement', {static: false}) selectContactResultsElement: CustomSelectAutocompleteComponent;

  private contactSourcesSelected = [];
  private usersSelected = [];
  private teamsSelected = [];
  private contactResultsSelected = [];
  // contactResultList = [];
  fromAssignedDate;
  toAssignedDate;
  contactResultIds = 0;
  minMatches = 1;
  searchString = '';
  userRole = UserProfile.getRole();
  ROLE = ROLE;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  setContactSourcesList(list: any[]) {
    this.selectContactsElement.setData(list);
  }

  setUsersList(list: any[]) {
    if (this.selectUsersElement) {
      this.selectUsersElement.setData(list);
    }
  }

  setTeamsList(list: any[]) {
    if (this.selectTeamsElement) {
      this.selectTeamsElement.setData(list);
    }
  }

  setContactResultsList(list: any[]) {
    this.selectContactResultsElement.setData(list);
    this.selectContactResultsElement.isColorName = true;
  }

  setSelectedContacts(value: string) {
    if (value) {
      this.selectContactsElement.setSelectedDataBaseOnValue(value.split(',').map(i => parseInt(i, 10)));
    } else {
      this.selectContactsElement.clearSelectedData();
    }
  }

  setSelectedUsers(value: string) {
    if (this.selectUsersElement) {
      if (value) {
        this.selectUsersElement.setSelectedDataBaseOnValue(value.split(',').map(i => parseInt(i, 10)));
      } else {
        this.selectUsersElement.clearSelectedData();
      }
    }
  }

  setSelectedTeams(value: string) {
    if (this.selectTeamsElement) {
      if (value) {
        this.selectTeamsElement.setSelectedDataBaseOnValue(value.split(',').map(i => parseInt(i, 10)));
      } else {
        this.selectTeamsElement.clearSelectedData();
      }
    }
  }

  setFromAssignedDate(date: string) {
    if (date) {
      this.fromAssignedDate = Utils.DateTime.convertDateTimeDDMMYYYY(date);
    } else {
      this.fromAssignedDate = undefined;
    }
  }

  setToAssignedDate(date: string) {
    if (date) {
      this.toAssignedDate = Utils.DateTime.convertDateTimeDDMMYYYY(date);
    } else {
      this.toAssignedDate = undefined;
    }
  }

  setContactResultIds(value: string) {
    if (value) {
      this.selectContactResultsElement.setSelectedDataBaseOnValue(value.split(',').map(i => parseInt(i, 10)));
    } else {
      this.selectContactResultsElement.clearSelectedData();
    }
  }

  setMinMatches(value: number) {
    if (value > 0) {
      this.minMatches = value;
    } else {
      this.minMatches = 1;
    }
  }

  getSelectedContactResults(data) {
    this.contactResultsSelected = data;
  }

  getSelectedContacts(data) {
    this.contactSourcesSelected = data;
  }

  getSelectedUsers(data) {
    this.usersSelected = data;
  }

  getSelectedTeams(data) {
    this.teamsSelected = data;
  }

  getHandledQueryParams() {
    const handledQueryParams = {};
    if (this.contactSourcesSelected && this.contactSourcesSelected.length > 0) {
     handledQueryParams['contactSourceIds'] = Utils.joinArray(this.contactSourcesSelected, ',');
   }
   if (this.fromAssignedDate) {
     handledQueryParams['fromAssignedDate'] = Utils.DateTime.convertDateStringDDMMYYYY(this.fromAssignedDate);
   }
   if (this.toAssignedDate) {
     handledQueryParams['toAssignedDate'] = Utils.DateTime.convertDateStringDDMMYYYY(this.toAssignedDate);
   }
   if (this.teamsSelected && this.teamsSelected.length > 0) {
     handledQueryParams['assignedTeamIds'] = Utils.joinArray(this.teamsSelected, ',');
   }
   if (this.usersSelected && this.usersSelected.length > 0) {
     handledQueryParams['assignedUserIds'] = Utils.joinArray(this.usersSelected, ',');
   }
   if (this.contactResultsSelected && this.contactResultsSelected.length > 0) {
     handledQueryParams['contactResultIds'] = Utils.joinArray(this.contactResultsSelected, ',');
     handledQueryParams['minMatches'] = this.minMatches;
   }
   return handledQueryParams;
  }

  search() {
    this.routeWithQueryParams(this.getHandledQueryParams());
  }

  routeWithQueryParams(queryParams: IContactsFiltersQueryParams) {
    this.router.navigate([Routing.CONTACTS], { queryParams: queryParams });
  }

}

interface IContactsFiltersQueryParams {
  contactSourceIds?: string;
  fromAssignedDate?: string;
  toAssignedDate?: string;
  assignedTeamIds?: string;
  assignedUserIds?: string;
  contactResultIds?: number;
  minMatches?: number;
}
