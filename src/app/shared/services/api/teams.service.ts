import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiNDP } from '../../helpers/api';
import { Utils } from '../../helpers/utilities';

@Injectable()
export class TeamsService {

  private apiUrl = Utils.getProjectApi(ApiNDP.Teams);

  constructor(private http: HttpClient) {
  }

  private addIdIntoUrl(id: number) {
    return this.apiUrl + '/' + id;
  }

  getList(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getTeamName(): Observable<any> {
    return this.http.get(`${this.apiUrl}/names`);
  }

  getTeam(id: number): Observable<any> {
    return this.http.get(this.addIdIntoUrl(id));
  }

  updateTeam(id: number, data: any) {
    return this.http.patch(this.addIdIntoUrl(id), { name: data });
  }

  createTeam(data: any) {
    return this.http.post(this.apiUrl, { name: data });
  }

  deleteTeam(id: number) {
    return this.http.delete(this.addIdIntoUrl(id));
  }

}
