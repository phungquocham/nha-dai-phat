import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


import { ApiNDP } from '../../helpers/api';
import { Utils } from '../../helpers/utilities';

@Injectable()
export class ContactResultsService {


  constructor(private http: HttpClient) {
  }

  getListContactResultNames(): Observable<any> {
    const url = Utils.getProjectApi(`${ApiNDP.ContactResults}/${ApiNDP.Names}`);
    return this.http.get(url);
  }

  getListContactResults(): Observable<any> {
    const url = Utils.getProjectApi(`${ApiNDP.ContactResults}`);
    return this.http.get(url);
  }

  createContactResult(data): Observable<any> {
    const url = Utils.getProjectApi(`${ApiNDP.ContactResults}`);
    return this.http.post(url, data);
  }

  getContactResult(id: number): Observable<any> {
    const url = Utils.getProjectApi(`${ApiNDP.ContactResults}/${id}`);
    return this.http.get(url);
  }

  updateContactResult(id: number, data): Observable<any> {
    console.log(data);
    const url = Utils.getProjectApi(`${ApiNDP.ContactResults}/${id}`);
    return this.http.patch(url, data);
  }

  deleteContactResult(id: number): Observable<any> {
    const url = Utils.getProjectApi(`${ApiNDP.ContactResults}/${id}`);
    return this.http.delete(url);
  }

}
