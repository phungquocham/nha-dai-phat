import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiNDP } from '../../helpers/api';
import { Utils } from '../../helpers/utilities';
import { map } from 'rxjs/operators';

@Injectable()
export class DailyReportService {
  private apiUrl = Utils.getProjectApi(ApiNDP.DailyReports);

  constructor(private http: HttpClient) {
  }

  addIdIntoUrl(id: number) {
    return this.apiUrl + '/' + id;
  }

  getList(filterData: any): Observable<any> {
    const url = Utils.getProjectApi(`${ApiNDP.DailyReports}${Utils.encodeQueryData(filterData)}`);
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

  getSourceName() {
    return this.http.get(Utils.getProjectApi(`${ApiNDP.Sources}/${ApiNDP.Names}`));
  }

  getRatingName() {
    return this.http.get(Utils.getProjectApi(`${ApiNDP.Ratings}/${ApiNDP.Names}`)).pipe(
      map(
        (response: any) => {

          const data = {
            pourings: [],
            pushings: [],
            others: [],
            total: []
          };
          response.map((item: any) => {
            // tslint:disable-next-line:no-bitwise
            if ((item.types & 1) !== 0) {
              data.pourings.push(item);
            }
            // tslint:disable-next-line:no-bitwise
            if ((item.types & 2) !== 0) {
              data.pushings.push(item);
            }
            // tslint:disable-next-line:no-bitwise
            if ((item.types & 4) !== 0) {
              data.others.push(item);
            }
            item.value = 0;
          });
          data.total = response;
          return data;
        }
      )
    );
  }

  getProjectName() {
    return this.http.get(Utils.getProjectApi(`${ApiNDP.Projects}/${ApiNDP.Names}`));
  }

  getReportDate(reportUserId?: any) {
    let queryString = '';
    if (reportUserId) {
      queryString = `?reportUserId=${reportUserId}`;
    }
    return this.http.get(Utils.getProjectApi(`${ApiNDP.DailyReports}/${ApiNDP.New}${queryString}`));
  }
}
