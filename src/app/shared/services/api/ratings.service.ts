import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiNDP } from '../../helpers/api';
import { Utils } from '../../helpers/utilities';

@Injectable({
  providedIn: 'root'
})
export class RatingsService {

  private apiUrl = Utils.getProjectApi(ApiNDP.Ratings);

  constructor(private http: HttpClient) {
  }

  getRatingsList(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getRatingNamesList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/${ApiNDP.Names}`);
  }

  updateRating(id: number, data: any) {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  aggregateRatings() {
    return this.http.get(`${this.apiUrl}/${ApiNDP.Aggregate}`);
  }
}
