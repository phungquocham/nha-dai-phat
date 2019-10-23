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

}
