import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiNDP } from '../../helpers/api';
import { Utils } from '../../helpers/utilities';

@Injectable()
export class RatingReportsService {

  constructor(private http: HttpClient) {
  }

  getList(filterData: any): Observable<any> {
    const url = Utils.getProjectApi(`${ApiNDP.DailyReports}/${ApiNDP.Rating_Change_Aggregate}${Utils.encodeQueryData(filterData)}`);
    return this.http.get(url);
  }

}
