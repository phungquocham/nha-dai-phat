import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiNDP } from '../../helpers/api';
import { Utils } from '../../helpers/utilities';

@Injectable()
export class ProjectsService {

  private apiUrl = Utils.getProjectApi(ApiNDP.Projects);

  constructor(private http: HttpClient) {
  }

  private addIdIntoUrl(id: number) {
    return this.apiUrl + '/' + id;
  }

  getList(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getProject(id: number): Observable<any> {
    return this.http.get(this.addIdIntoUrl(id));
  }

  updateProject(id: number, data: any) {
    console.log(id, data);
    return this.http.patch(this.addIdIntoUrl(id), { name: data } );
  }

  createProject(data: any) {
    return this.http.post(this.apiUrl, { name: data });
  }

  deleteProject(id: number) {
    return this.http.delete(this.addIdIntoUrl(id));
  }

}
