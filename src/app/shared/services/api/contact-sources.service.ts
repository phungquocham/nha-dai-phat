import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiNDP} from '../../helpers/api';
import {Utils} from '../../helpers/utilities';

@Injectable()
export class ContactSourceService {
  private apiUrl = Utils.getProjectApi(ApiNDP.ContactSources);

  constructor(private http: HttpClient) {
  }

  addIdIntoUrl(id: number) {
    return this.apiUrl + '/' + id;
  }

  create(id: any, data: any) {
    const url = Utils.getProjectApi(`${ApiNDP.ContactSources}/${id}/assignments`);
    return this.http.post(url, data);
  }

  getList(filterData: any): Observable<any> {
    const url = Utils.getProjectApi(`${ApiNDP.ContactSources}${Utils.encodeQueryData(filterData)}`);
    return this.http.get(url);
  }

  getListId(id: any): Observable<any> {
    const url = Utils.getProjectApi(`${ApiNDP.ContactSources}/${id}`);
    return this.http.get(url);
  }

  getListName() {
    return this.http.get(Utils.getProjectApi(`${ApiNDP.ContactSources}/names`));
  }

  deleteAssignments(id, assignedDatePrototype) {
    return this.http.delete(Utils.getProjectApi(`${ApiNDP.ContactSources}/${id}/assignments/${assignedDatePrototype}`));
  }
  delete(id) {
    return this.http.delete(Utils.getProjectApi(`${ApiNDP.ContactSources}/${id}`));
  }
  assignedDate(id: any, data: any, assignedDate) {
    const url = Utils.getProjectApi(`${ApiNDP.ContactSources}/${id}/assignments/${assignedDate}`);
    return this.http.patch(url, data);
  }

  update(id, data) {
    const url = Utils.getProjectApi(`${ApiNDP.ContactSources}/${id}`);
    return this.http.patch(url, data);
  }
  getResultName() {
    return this.http.get(Utils.getProjectApi(`contact-results/names`));
  }
  deleteContactResult(id, contactResultId, assignedDates) {
    return this.http.delete(Utils.getProjectApi(`${ApiNDP.ContactSources}/${id}/${contactResultId}?assignedDates=${assignedDates}`));
  }
}
