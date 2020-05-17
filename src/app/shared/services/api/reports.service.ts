import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiNDP } from '../../helpers/api';
import { Utils } from '../../helpers/utilities';
import { map } from 'rxjs/operators';
import { ModelReportResponseInRow, IReportResponse } from 'src/app/components/reports/reports.model';
import { isString } from 'util';

@Injectable()
export class ReportsService {

  private apiUrl = Utils.getProjectApi(ApiNDP.DailyReports);

  constructor(private http: HttpClient) {
  }

  static GetReportTypesList(ratingsList: any[]): any {
    const pour = [], push = [], others = [];
    if (ratingsList) {
      ratingsList.forEach(item => {
        //  tslint:disable-next-line:no-bitwise
        if ((item.types & 1) !== 0) {
          pour.push('_' + item.id);
        }
        //  tslint:disable-next-line:no-bitwise
        if ((item.types & 2) !== 0) {
          push.push('_' + item.id);
        }
        //  tslint:disable-next-line:no-bitwise
        if ((item.types & 4) !== 0) {
          others.push('_' + item.id);
        }
      });
    }
    return {
      pourIds: pour,
      pushIds: push,
      othersIds: others
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
    ratingIds: string[],
    ratingSourcesData: any
  }) {
    const result = {};
    data.ratingIds.forEach(id => {
        result[id] = [];
    });
    Object.keys(data.ratingSourcesData).forEach(id => {
      result['_' + id] = data.ratingSourcesData[id];
    });
    return result;
  }

  aggregateReports(data: { query: IAggregateReports, sourcesList?: any[], teamsList?: any[], ratingsList: any[] }): Observable<any> {
    let url = '';
    if (!data.query) {
      url = `?fromDate=&toDate=&teams=&users=&sources=&projects=`;
    } else {
      url = `?fromDate=${encodeURIComponent(data.query.fromDate)}&toDate=${encodeURIComponent(data
        .query.toDate)}&teams=${data.query.teams}&users=${data.query.users}&sources=${data.query.sources}&projects=${data.query.projects}`;
      url = url.replace(/undefined/g, '');
    }
    return this.http.get(`${this.apiUrl}/${ApiNDP.Aggregate}${url}`).pipe(map((res: any[]) => {
      res.forEach((report: ModelReportResponseInRow) => {
        report.reportUserNameTooltip = report.reportUserName;
        const words = report.reportUserName.split(' ');
        report.reportUserName = words[0] + ' ' + words[1];
      });

      if (!data.sourcesList && !data.teamsList) {
        return res;
      }
      const { pourIds, pushIds, othersIds } = ReportsService.GetReportTypesList(data.ratingsList);
      res.forEach(report => {
        if (report.ratingSources) {
          data.sourcesList.forEach(source => {
            if (!report.ratingSources[source.id]) {
              report.ratingSources[source.id] = {
                1: {},
                2: {},
                4: {}
              };
            }
            report.ratingSources[source.id][1] = this.convertRatingSourcesBaseOnType({
              ratingIds: pourIds,
              ratingSourcesData: report.ratingSources[source.id][1]
            });
            report.ratingSources[source.id][2] = this.convertRatingSourcesBaseOnType({
              ratingIds: pushIds,
              ratingSourcesData: report.ratingSources[source.id][2]
            });
            report.ratingSources[source.id][4] = this.convertRatingSourcesBaseOnType({
              ratingIds: othersIds,
              ratingSourcesData: report.ratingSources[source.id][4]
            });
          });
        }
      });
      const groupTeam = Utils.groupItemsInArray(res, 'teamId'),
        reportsGrouped = [],
        customTeamsList = [];
      Object.keys(groupTeam).forEach(teamId => {
        const founded = data.teamsList.find(team => team.id === +teamId);
        if (founded) {
          const team = new ModelReportResponseInRow();
          team.reportUserId = `team_` + teamId;
          team.reportUserName = founded.name;
          team.isTeamRow = true;
          team.generateRatingSourcesKeys(data.sourcesList, pourIds, pushIds, othersIds);
          groupTeam[teamId].forEach((item: ModelReportResponseInRow) => {
            team.goldenHours += item.goldenHours;
            team.pushCount += item.pushCount;
            team.suggestionCount += item.suggestionCount;
            team.emailCount += item.emailCount;
            team.flirtingCount += item.flirtingCount;
            team.selfPouring.uncontactable += item.selfPouring.uncontactable;
            team.selfPouring.notPickUp += item.selfPouring.notPickUp;
            team.selfPouring.noNeed += item.selfPouring.noNeed;
            team.selfPouring.hangUp += item.selfPouring.hangUp;
            team.selfPouring.twoSentences += item.selfPouring.twoSentences;
            team.selfPouring.moreThanTwoSentences += item.selfPouring.moreThanTwoSentences;
            team.regularPouring.uncontactable += item.regularPouring.uncontactable;
            team.regularPouring.notPickUp += item.regularPouring.notPickUp;
            team.regularPouring.noNeed += item.regularPouring.noNeed;
            team.regularPouring.hangUp += item.regularPouring.hangUp;
            team.regularPouring.twoSentences += item.regularPouring.twoSentences;
            team.regularPouring.moreThanTwoSentences += item.regularPouring.moreThanTwoSentences;
            if (item.ratingSources) {
              Object.keys(item.ratingSources).forEach(sourceId => {
                Object.keys(item.ratingSources[sourceId][1]).forEach(ratingId => {
                  if (item.ratingSources[sourceId][1][ratingId]) {
                    item.ratingSources[sourceId][1][ratingId].forEach(project => {
                      team.ratingSources[sourceId][1][ratingId].push(project);
                    });
                  }
                });
                Object.keys(item.ratingSources[sourceId][2]).forEach(ratingId => {
                  if (item.ratingSources[sourceId][2][ratingId]) {
                    item.ratingSources[sourceId][2][ratingId].forEach(project => {
                      team.ratingSources[sourceId][2][ratingId].push(project);
                    });
                  }
                });
                Object.keys(item.ratingSources[sourceId][4]).forEach(ratingId => {
                  if (item.ratingSources[sourceId][4][ratingId]) {
                    item.ratingSources[sourceId][4][ratingId].forEach(project => {
                      team.ratingSources[sourceId][4][ratingId].push(project);
                    });
                  }
                });
              });
            }
          });
          Object.keys(team.ratingSources).forEach(sourceId => {
            Object.keys(team.ratingSources[sourceId][1]).forEach(ratingId => {
              const result = [];
              team.ratingSources[sourceId][1][ratingId].forEach(item => {
                const ttFounded = result.find(resultItem => resultItem.id === item[0]);
                if (ttFounded) {
                  ttFounded.value += item[1];
                } else {
                  result.push({
                    id: item[0],
                    value: item[1]
                  });
                }
              });
              team.ratingSources[sourceId][1][ratingId] = [];
              result.forEach(item => {
                team.ratingSources[sourceId][1][ratingId].push([item.id, item.value]);
              });
            });

            Object.keys(team.ratingSources[sourceId][2]).forEach(ratingId => {
              const result = [];
              team.ratingSources[sourceId][2][ratingId].forEach(item => {
                const ttFounded = result.find(resultItem => resultItem.id === item[0]);
                if (ttFounded) {
                  ttFounded.value += item[1];
                } else {
                  result.push({
                    id: item[0],
                    value: item[1]
                  });
                }
              });
              team.ratingSources[sourceId][2][ratingId] = [];
              result.forEach(item => {
                team.ratingSources[sourceId][2][ratingId].push([item.id, item.value]);
              });
            });

            Object.keys(team.ratingSources[sourceId][4]).forEach(ratingId => {
              const result = [];
              team.ratingSources[sourceId][4][ratingId].forEach(item => {
                const ttFounded = result.find(resultItem => resultItem.id === item[0]);
                if (ttFounded) {
                  ttFounded.value += item[1];
                } else {
                  result.push({
                    id: item[0],
                    value: item[1]
                  });
                }
              });
              team.ratingSources[sourceId][4][ratingId] = [];
              result.forEach(item => {
                team.ratingSources[sourceId][4][ratingId].push([item.id, item.value]);
              });
            });

          });
          reportsGrouped.push(team);
          customTeamsList.push(team);
          groupTeam[teamId].forEach(item => {
            reportsGrouped.push(item);
          });
        }
      });


      reportsGrouped.forEach(report => {
        if (report.ratingSources) {
          data.sourcesList.forEach(source => {
            pourIds.forEach(ratingId => {
              report.ratingSources[source.id][1][ratingId].sort((a, b) => b[0] - a[0]);
            });
            pushIds.forEach(ratingId => {
              report.ratingSources[source.id][2][ratingId].sort((a, b) => b[0] - a[0]);
            });
            othersIds.forEach(ratingId => {
              report.ratingSources[source.id][4][ratingId].sort((a, b) => b[0] - a[0]);
            });
          });
        }
      });

      const totalRatingResourcesByColumn = {};
      data.sourcesList.forEach(item => {
        totalRatingResourcesByColumn[item.id] = {
          1: {},
          2: {},
          4: {}
        };
        pourIds.forEach(ratingId => {
          totalRatingResourcesByColumn[item.id][1][ratingId] = [];
        });
        pushIds.forEach(ratingId => {
          totalRatingResourcesByColumn[item.id][2][ratingId] = [];
        });
        othersIds.forEach(ratingId => {
          totalRatingResourcesByColumn[item.id][4][ratingId] = [];
        });
      });
      reportsGrouped.forEach((report: ModelReportResponseInRow) => {
        if (isString(report.reportUserId)) {
          Object.keys(report.ratingSources).forEach(sourceId => {
            pourIds.forEach(ratingId => {
              totalRatingResourcesByColumn[sourceId][1][ratingId] =
                totalRatingResourcesByColumn[sourceId][1][ratingId].concat(report.ratingSources[sourceId][1][ratingId]);
            });
            pushIds.forEach(ratingId => {
              totalRatingResourcesByColumn[sourceId][2][ratingId] =
                totalRatingResourcesByColumn[sourceId][2][ratingId].concat(report.ratingSources[sourceId][2][ratingId]);
            });
            othersIds.forEach(ratingId => {
              totalRatingResourcesByColumn[sourceId][4][ratingId] =
                totalRatingResourcesByColumn[sourceId][4][ratingId].concat(report.ratingSources[sourceId][4][ratingId]);
            });
          });
        }
      });
      reportsGrouped.forEach((report: ModelReportResponseInRow) => {
        if (isString(report.reportUserId)) {
          Object.keys(report.ratingSources).forEach(sourceId => {
            pourIds.forEach(ratingId => {
              const temp = [];
              totalRatingResourcesByColumn[sourceId][1][ratingId].forEach(item => {
                const founded = temp.find(itemTemp => itemTemp[0] === item[0]);
                if (!founded) {
                  const id = item[0], value = item[1];
                  temp.push([id, value]);
                } else {
                  founded[1] += item[1];
                }
              });
              totalRatingResourcesByColumn[sourceId][1][ratingId] = temp;
            });
            pushIds.forEach(ratingId => {
              const temp = [];
              totalRatingResourcesByColumn[sourceId][2][ratingId].forEach(item => {
                const founded = temp.find(itemTemp => itemTemp[0] === item[0]);
                if (!founded) {
                  const id = item[0], value = item[1];
                  temp.push([id, value]);
                } else {
                  founded[1] += item[1];
                }
              });
              totalRatingResourcesByColumn[sourceId][2][ratingId] = temp;
            });
            othersIds.forEach(ratingId => {
              const temp = [];
              totalRatingResourcesByColumn[sourceId][4][ratingId].forEach(item => {
                const founded = temp.find(itemTemp => itemTemp[0] === item[0]);
                if (!founded) {
                  const id = item[0], value = item[1];
                  temp.push([id, value]);
                } else {
                  founded[1] += item[1];
                }
              });
              totalRatingResourcesByColumn[sourceId][4][ratingId] = temp;
            });
          });
        }
      });
      let flagOdd = true;
      reportsGrouped.forEach((report: ModelReportResponseInRow, index) => {
        report.regularPouring.total = report.regularPouring.hangUp + report.regularPouring.noNeed + report.regularPouring.notPickUp +
        report.regularPouring.uncontactable + report.regularPouring.twoSentences + report.regularPouring.moreThanTwoSentences;
        report.selfPouring.total = report.selfPouring.hangUp + report.selfPouring.noNeed + report.selfPouring.notPickUp +
        report.selfPouring.uncontactable + report.selfPouring.twoSentences + report.selfPouring.moreThanTwoSentences;
        if (!isString(report.reportUserId)) {
          report['isOddRow'] = flagOdd;
          flagOdd = !flagOdd;
        }
      });
      return {
        reportsData: reportsGrouped,
        totalRatingResourcesByColumn
      };
    }));
  }

  // private getTooltipsByColumn(arrayTotal: any[], arrayRow: any[]) {
  //   const result = [];
  //   if (arrayRow) {
  //     arrayRow.forEach(item => {
  //       const founded = arrayTotal.find(itemTotal => itemTotal[0] === item[0]);
  //       const id = item[0], value = item[1];
  //       console.log(item[0], arrayTotal);
  //       if (!founded) {
  //         result.push([id, value]);
  //       } else {
  //         const total = founded[1] + value;
  //         result.push([founded[0], total]);
  //       }
  //     });
  //   }
  //   return result;
  // }

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
