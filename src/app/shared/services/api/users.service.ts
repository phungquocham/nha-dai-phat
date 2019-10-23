import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiNDP } from '../../helpers/api';
import { Utils } from '../../helpers/utilities';
import { map } from 'rxjs/operators';
import { UserProfile } from '../../models/user.profile.namespace';
import { Routing } from '../../helpers/routing';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = Utils.getProjectApi(ApiNDP.Users);

  constructor(private http: HttpClient) {
  }

  private addIdIntoUrl(id: number) {
    return this.apiUrl + '/' + id;
  }

  getList(query?: string): Observable<any> {
    const url = `${this.apiUrl}${query ? query : ''}`;
    return this.http.get(url);
  }

  getUserName(teamId?: number): Observable<any> {
    if (teamId) {
      return this.http.get(`${this.apiUrl}/names?teamId=${teamId}`);
    }
    return this.http.get(`${this.apiUrl}/names`);
  }

  getUserNamesList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/${ApiNDP.Names}`);
  }

  getUser(id: number): Observable<any> {
    return this.http.get(this.addIdIntoUrl(id));
  }

  getAuthenticatedUser() {
    return this.http.get(`${this.apiUrl}/${ApiNDP.Me}`).pipe(map(res => {
      UserProfile.setProfile(res);
      console.log(res);
      return;
    }));
  }

  updateUser(id: number, data: any) {
    return this.http.patch(this.addIdIntoUrl(id), data);
  }

  createUser(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  deleteUser(id: number) {
    return this.http.delete(this.addIdIntoUrl(id));
  }

  lockUser(id: number) {
    return this.http.put(`${this.addIdIntoUrl(id)}/${ApiNDP.Lock}`, {});
  }

  unlockUser(id: number) {
    return this.http.delete(`${this.addIdIntoUrl(id)}/${ApiNDP.Lock}`);
  }

}
