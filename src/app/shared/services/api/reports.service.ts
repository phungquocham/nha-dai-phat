import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiNDP } from '../../helpers/api';
import { Utils } from '../../helpers/utilities';
import { map } from 'rxjs/operators';
import {
  ModelReportResponseInRow,
  IReportResponse,
} from 'src/app/components/reports/reports.model';
import { isString } from 'util';

@Injectable()
export class ReportsService {
  private apiUrl = Utils.getProjectApi(ApiNDP.DailyReports);

  constructor(private http: HttpClient) {}

  static GetRatingTypesFull(ratingsList: any[]): any {
    const pour = [];
    const push = [];
    const other = [];
    const hint = [];
    if (ratingsList) {
      ratingsList.forEach((item) => {
        //  tslint:disable-next-line:no-bitwise
        if ((item.types & 1) !== 0) {
          pour.push('_' + item.id);
        }
        //  tslint:disable-next-line:no-bitwise
        if ((item.types & 2) !== 0) {
          push.push('_' + item.id);
        }
        //  tslint:disable-next-line:no-bitwise
        if ((item.types & 8) !== 0) {
          hint.push('_' + item.id);
        }
        //  tslint:disable-next-line:no-bitwise
        if ((item.types & 4) !== 0) {
          other.push('_' + item.id);
        }
      });
    }
    return {
      pourIds: pour,
      pushIds: push,
      hintIds: hint,
      otherIds: other,
    };
  }

  private addIdIntoUrl(id: number) {
    return this.apiUrl + '/' + id;
  }

  getDailyReports(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getReport(id: number): Observable<any> {
    return this.http.get(this.addIdIntoUrl(id));
  }

  createReport(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  private convertRatingSourcesBaseOnType(data: {
    ratingIds: string[];
    ratingSourcesData: any;
  }) {
    const result = {};
    data.ratingIds.forEach((id) => {
      result[id] = [];
    });
    Object.keys(data.ratingSourcesData).forEach((id) => {
      result['_' + id] = data.ratingSourcesData[id];
    });
    return result;
  }

  aggregateReports(data: {
    query: IAggregateReports;
    sourcesList?: any[];
    teamsList?: any[];
    ratingsList: any[];
  }): Observable<any> {
    let url = '';
    if (!data.query) {
      url = `?fromDate=&toDate=&teams=&users=&sources=&projects=`;
    } else {
      url = `?fromDate=${encodeURIComponent(
        data.query.fromDate
      )}&toDate=${encodeURIComponent(data.query.toDate)}&teams=${
        data.query.teams
      }&users=${data.query.users}&sources=${data.query.sources}&projects=${
        data.query.projects
      }`;
      url = url.replace(/undefined/g, '');
    }
    return this.http.get(`${this.apiUrl}/${ApiNDP.Aggregate}${url}`).pipe(
      map((res: any[]) => {
        return res;
      })
    );
  }
}

interface IAggregateReports {
  fromDate?: string;
  toDate?: string;
  projects?: string;
  teams?: string;
  users?: string;
  sources?: string;
  sourcesList?: any[];
  teamsList?: any[];
}
