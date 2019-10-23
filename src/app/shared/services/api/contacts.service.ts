import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiNDP } from '../../helpers/api';
import { Utils } from '../../helpers/utilities';
import { map } from 'rxjs/operators';

@Injectable()
export class ContactsService {
  private apiUrl = Utils.getProjectApi(ApiNDP.Contacts);

  constructor(private http: HttpClient) {
  }

  addIdIntoUrl(id: number) {
    return this.apiUrl + '/' + id;
  }

  updateAnAssignment(data: {
    contactId: number,
    newData: any,
    assignedDate: number,
    assignedUserId: number
  }) {
    return this.http.patch(`${this.addIdIntoUrl(data.contactId)}/${ApiNDP.Assignments}/${data.assignedDate}-${data.assignedUserId}`, data.newData);
  }

  getList(filterData: any): Observable<any> {
    const url = Utils.getProjectApi(`${ApiNDP.Contacts}${Utils.encodeQueryData(filterData)}`);
    return this.http.get(url);
  }

  create(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  update(id: any, data: any) {
    return this.http.patch(this.addIdIntoUrl(id), data);
  }

  delete(id: any) {
    return this.http.delete(this.addIdIntoUrl(id));
  }

  getId(id: any) {
    return this.http.get(this.addIdIntoUrl(id));
  }

  import(data: any) {
    return this.http.post(this.apiUrl + '/import', data);
  }

  deleteMultipleContacts(ids: any[]) {
    return this.http.delete(`${this.apiUrl}?ids=${ids.join(',')}`);
  }

  export(data: IExportData) {
    const temp = {};
      temp['q'] = data.q || '';
    if (data.minMatches) {
      temp['minMatches'] = +data.minMatches;
    }
    if (data.fromAssignedDate) {
      temp['fromAssignedDate'] = data.fromAssignedDate;
    }
    if (data.toAssignedDate) {
      temp['toAssignedDate'] = data.toAssignedDate;
    }
    if (data.assignedTeamIds) {
      temp['assignedTeamIds'] = data.assignedTeamIds.split(',').map(i => +i);
    }
    if (data.assignedUserIds) {
      temp['assignedUserIds'] = data.assignedUserIds.split(',').map(i => +i);
    }
    if (data.contactResultIds) {
      temp['contactResultIds'] = data.contactResultIds.split(',').map(i => +i);
    }
    if (data.contactSourceIds) {
      temp['contactSourceIds'] = data.contactSourceIds.split(',').map(i => +i);
    }
    return this.http.post(this.apiUrl + '/export', temp);
  }

}

interface IExportData {
  assignedTeamIds?: string;
  assignedUserIds?: string;
  contactResultIds?: string;
  contactSourceIds?: string;
  fromAssignedDate?: string;
  minMatches?: number;
  q?: string;
  toAssignedDate?: string;
}
