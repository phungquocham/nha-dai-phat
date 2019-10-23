import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiNDP } from '../../helpers/api';
import { Utils } from '../../helpers/utilities';

@Injectable()
export class SourcesService {

  private apiUrl = Utils.getProjectApi(ApiNDP.Sources);

  constructor(private http: HttpClient) {
  }

  private addIdIntoUrl(id: number) {
    return this.apiUrl + '/' + id;
  }

  getList(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getSource(id: number): Observable<any> {
    return this.http.get(this.addIdIntoUrl(id));
  }

  updateSource(id: number, data: any) {
    return this.http.patch(this.addIdIntoUrl(id), data);
  }

  createSource(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  deleteSource(id: number) {
    return this.http.delete(this.addIdIntoUrl(id));
  }

}
