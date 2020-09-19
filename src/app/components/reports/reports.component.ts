import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ViewEncapsulation,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import cloneDeep from 'lodash/cloneDeep';

import { DialogService } from 'src/app/shared/services/others/dialog.service';
import { ReportsService } from 'src/app/shared/services/api/reports.service';
import { SourcesService } from 'src/app/shared/services/api/sources.service';
import { ProjectsService } from 'src/app/shared/services/api/projects.service';
import { RatingsService } from 'src/app/shared/services/api/ratings.service';
import { Utils } from 'src/app/shared/helpers/utilities';
import { TeamsService } from 'src/app/shared/services/api/teams.service';
import { UsersService } from 'src/app/shared/services/api/users.service';
import { Routing } from 'src/app/shared/helpers/routing';
import { PageLoadingService } from 'src/app/shared/services/others/page-loading.service';
import {
  IReportQueryParams,
  ReportQueryParams,
  IReportResponse,
  ModelReportResponseInRow,
} from './reports.model';
import { DialogReportsSelectOptionsComponent } from './dialogs/dialog-reports-select-options/dialog-reports-select-options.component';
import { CustomSelectAutocompleteComponent } from 'src/app/shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.component';
import { ExportReportExcelService } from 'src/app/shared/services/api/export-report-excel.service';
import { CalcTotalPourAndPushInRatingSourcesComponent } from './components/calc-total-pour-and-push-in-rating-sources/calc-total-pour-and-push-in-rating-sources.component';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  static BUFFER_SIZE = 3;

  @ViewChild('selectUsersElement')
  selectUsersElement: CustomSelectAutocompleteComponent;
  @ViewChild('selectTeamsElement')
  selectTeamsElement: CustomSelectAutocompleteComponent;
  @ViewChild('selectSourcesElement')
  selectSourcesElement: CustomSelectAutocompleteComponent;
  @ViewChild('selectProjectsElement')
  selectProjectsElement: CustomSelectAutocompleteComponent;

  @ViewChildren(CalcTotalPourAndPushInRatingSourcesComponent)
  ratingsSourceElements: QueryList<
    CalcTotalPourAndPushInRatingSourcesComponent
  >;

  @ViewChildren('ratingsSourceFooter')
  ratingsSourceFooter: QueryList<CalcTotalPourAndPushInRatingSourcesComponent>;

  private ngUnsubscribe = new Subject();

  showTeamRows = false;
  reportsData: any = [];
  displayedColumnsReport = [];
  sourcesList = [];
  sourcesColumnsList = [];
  sourcesSelected = [];
  projectsTooltip = '';
  startDate;
  endDate;
  teamsList = [];
  usersList = [];
  teamsSelected = [];
  usersSelected = [];
  isLoading = false;
  projectsList = [];
  projectsSelected = [];
  ratingsList = [];

  private previousQueryParams = new ReportQueryParams();

  mappingSources = {};
  mappingProjects = {};
  mappingRatings = {};
  mappingTeams = {};
  reportsRawData = [];
  reportTotalFooter = new ModelReportResponseInRow();
  mappingTeamsInTable = {};
  row = {
    pourIds: [],
    pushIds: [],
    hintIds: [],
    otherIds: [],
  };
  totalFooterWithPoints = 0;
  totalFooterRatingSources = {};
  showFooterTotal = true;

  constructor(
    private dialog: DialogService,
    private reportsService: ReportsService,
    private sourcesService: SourcesService,
    private projectsService: ProjectsService,
    private ratingsService: RatingsService,
    private teamsService: TeamsService,
    private usersService: UsersService,
    private pageLoadingService: PageLoadingService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private exportReportExcelService: ExportReportExcelService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    forkJoin(
      this.sourcesService.getList(),
      this.projectsService.getList(),
      this.teamsService.getList(),
      this.usersService.getUserNamesList(),
      this.ratingsService.getRatingNamesList()
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const keys = [
          'reportUserName',
          'goldenHours',
          'regularPouring',
          'selfPouring',
          'pushCount',
          'suggestionCount',
          'emailCount',
          'flirtingCount',
          // 'totalSources'
        ];
        keys.push('column0');
        this.sourcesList.push({
          id: 0,
          name: 'TỔNG NGUỒN',
          column: 'column0',
          color: '#daa520',
        });
        res[0].forEach((item, index) => {
          item.column = 'column' + (index + 1);
          keys.push(item.column);
          this.sourcesList.push(item);
        });
        // keys.push('totalRatingPoints');
        this.displayedColumnsReport = keys;
        this.sourcesList.forEach((item) => {
          const obj = {
            id: item.id,
            name: item.name,
            showColumn: item.showColumn,
          };
          this.sourcesColumnsList.push(obj);
        });
        this.projectsList = res[1];
        this.teamsList = res[2];
        this.usersList = res[3];
        this.ratingsList = res[4];
        this.selectUsersElement.setData(this.usersList);
        this.selectTeamsElement.setData(this.teamsList);
        this.selectSourcesElement.setData(this.sourcesList);
        this.selectProjectsElement.setData(this.projectsList);
        this.detechChanges();
        this.subscribePageLoading();
        this.subscribeQueryParams();

        this.mappingSources = this.mappingObjectFromList(this.sourcesList);
        this.mappingProjects = this.mappingObjectFromList(this.projectsList);
        this.mappingRatings = this.mappingObjectFromList(
          this.ratingsList,
          'id',
          '_'
        );
        this.mappingTeams = this.mappingObjectFromList(this.teamsList);
        const {
          pourIds,
          pushIds,
          hintIds,
          otherIds,
        } = ReportsService.GetRatingTypesFull(this.ratingsList);
        this.row.pourIds = pourIds;
        this.row.pushIds = pushIds;
        this.row.hintIds = hintIds;
        this.row.otherIds = otherIds;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private detechChanges() {
    this.cdr.detectChanges();
  }

  getSelectedUsers(selected) {
    this.usersSelected = selected;
  }

  getSelectedTeams(selected) {
    this.teamsSelected = selected;
  }

  getSelectedSources(selected) {
    this.sourcesSelected = selected;
  }

  getSelectedProjects(selected) {
    this.projectsSelected = selected;
  }

  openDialogSelectReports() {
    this.dialog
      .open({
        component: DialogReportsSelectOptionsComponent,
        data: {
          projectsList: this.projectsList,
          teamsList: this.teamsList,
          usersList: this.usersList,
          sourcesColumnsList: this.sourcesColumnsList,
        },
      })
      .subscribe((res) => {
        if (res) {
          if (res.export) {
            this.exportReportToExcel();
            return;
          }
          this.routeWithQueryParams({
            fromDate: res.startDate,
            toDate: res.endDate,
            projects: Utils.joinArray(res.projectsSelected, ','),
            teams: Utils.joinArray(res.teamsSelected, ','),
            users: Utils.joinArray(res.usersSelected, ','),
            sources: Utils.joinArray(res.sourcesColumnsSelected, ','),
          });
        }
      });
  }

  private subscribePageLoading() {
    this.pageLoadingService.loading$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: any[]) => {
        res.length > 0 ? (this.isLoading = true) : (this.isLoading = false);
        this.detechChanges();
      });
  }

  private subscribeQueryParams() {
    this.route.queryParams.subscribe((queryParams: IReportQueryParams) => {
      this.isLoading = true;
      if (queryParams.fromDate) {
        this.startDate = Utils.DateTime.convertDateTimeDDMMYYYY(
          queryParams.fromDate
        );
      }
      if (queryParams.toDate) {
        this.endDate = Utils.DateTime.convertDateTimeDDMMYYYY(
          queryParams.toDate
        );
      }
      if (queryParams.projects) {
        this.projectsSelected = queryParams.projects
          .split(',')
          .map((i) => parseInt(i, 10));
        this.selectProjectsElement.setSelectedDataBaseOnValue(
          this.projectsSelected
        );
      }
      if (queryParams.teams) {
        this.teamsSelected = queryParams.teams
          .split(',')
          .map((i) => parseInt(i, 10));
        this.selectTeamsElement.setSelectedDataBaseOnValue(this.teamsSelected);
        this.showTeamRows = true;
      } else {
        this.showTeamRows = false;
      }
      if (queryParams.users) {
        this.usersSelected = queryParams.users
          .split(',')
          .map((i) => parseInt(i, 10));
        this.selectUsersElement.setSelectedDataBaseOnValue(this.usersSelected);
      }
      if (queryParams.sources) {
        this.sourcesSelected = queryParams.sources
          .split(',')
          .map((i) => parseInt(i, 10));
        this.selectSourcesElement.setSelectedDataBaseOnValue(
          this.sourcesSelected
        );
        this.sourcesList.forEach((item) => {
          if (
            this.sourcesSelected.findIndex(
              (selectedId) => selectedId === item.id
            ) > -1
          ) {
            item.showColumn = true;
          } else {
            item.showColumn = false;
          }
        });
      } else {
        this.sourcesList.forEach((item) => {
          item.showColumn = false;
        });
      }
      this.previousQueryParams.setData(queryParams);
      this.detechChanges();
      this.getReportsList(queryParams);
    });
  }

  private getReportsList(queryParams: any) {
    this.isLoading = true;
    this.reportsService
      .aggregateReports({
        query: queryParams,
        sourcesList: this.sourcesList,
        teamsList: this.teamsList,
        ratingsList: this.ratingsList,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.showFooterTotal = false;
        setTimeout(() => {
          this.showFooterTotal = true;
          this.detechChanges();
        }, 0);
        this.resetReportTotalFooter();
        data = orderBy(data, ['reportUserName'], ['asc']);
        if (this.isTeamRow()) {
          this.resetTeamsInTable();
          data = this.handleReportsWithTeams(data);
          this.totalFooterRatingSources = this.calcFooterRatingSources(
            data.filter(
              (reportData: ModelReportResponseInRow) =>
                reportData.id && reportData.id.includes('team_')
            )
          );
        } else {
          this.totalFooterRatingSources = this.calcFooterRatingSources(data);
        }
        this.reportsData = data;
        this.handledReports(this.reportsData, this.isTeamRow());
        this.isLoading = false;
        this.detechChanges();
      });
  }

  clickReportButton() {
    setTimeout(() => {
      if (!this.startDate) {
        this.startDate = new Date();
      }
      if (!this.endDate) {
        this.endDate = new Date();
      }
      this.routeWithQueryParams({
        fromDate: Utils.DateTime.convertDateStringDDMMYYYY(this.startDate),
        toDate: Utils.DateTime.convertDateStringDDMMYYYY(this.endDate),
        projects: Utils.joinArray(this.projectsSelected, ','),
        teams: Utils.joinArray(this.teamsSelected, ','),
        users: Utils.joinArray(this.usersSelected, ','),
        sources: Utils.joinArray(this.sourcesSelected, ','),
      });
    }, 50);
  }

  private routeWithQueryParams(queryParams: IReportQueryParams) {
    console.log(queryParams);
    this.router.navigate([Routing.REPORTS], { queryParams });
  }

  mappingObjectFromList(list: any[], key = 'id', char = '') {
    const obj = {};
    list.forEach((item) => {
      if (char) {
        obj[char + item[key]] = item;
      } else {
        obj[item[key]] = item;
      }
    });
    return obj;
  }

  handledReports(reports: IReportResponse[], isTeamRow?: boolean) {
    // tslint:disable-next-line:no-shadowed-variable
    reports.forEach((report) => {
      if (!report.id) {
        // userReport
        this.handleReportUserNameWithTooltip(report);
      }
      this.handleReportPouringTotal(report, 'regularPouring');
      this.handleReportPouringTotal(report, 'selfPouring');
      this.calcBasicReportInRow(this.reportTotalFooter, report);
      if (isTeamRow) {
        this.calcBasicReportInRow(
          this.mappingTeamsInTable['team_' + report.teamId],
          report
        );
      }
    });
    if (isTeamRow) {
      reports.forEach((item: ModelReportResponseInRow) => {
        if (item.id) {
          if (item.id.includes('team_')) {
            this.calcBasicReportInRow(item, this.mappingTeamsInTable[item.id]);
          }
        }
      });
      this.reportsData = reports;
      this.detechChanges();
    }
  }

  private isTeamRow() {
    return this.teamsSelected.length > 0;
  }

  private handleReportsWithTeams(reports: IReportResponse[]): any[] {
    const groups = groupBy(reports, 'teamId');
    const reportsWithTeam = [];
    Object.keys(groups).forEach((teamId) => {
      this.mappingTeamsInTable[
        'team_' + teamId
      ] = new ModelReportResponseInRow();
      const teamRow = new ModelReportResponseInRow();
      teamRow.setTeamType(teamId, this.mappingTeams[teamId].name);
      teamRow.ratingSources = this.calcFooterRatingSources(groups[teamId]);
      reportsWithTeam.push(teamRow);
      groups[teamId].forEach((userRow) => {
        reportsWithTeam.push(userRow);
      });
    });
    return reportsWithTeam;
  }

  // tslint:disable-next-line:no-shadowed-variable
  private handleReportUserNameWithTooltip(report: IReportResponse) {
    report.reportUserNameTooltip = report.reportUserName;
    const words = report.reportUserName.split(' ');
    report.reportUserName = `${words[0]} ${words[1]}`;
  }

  private handleReportPouringTotal(
    // tslint:disable-next-line:no-shadowed-variable
    report: IReportResponse,
    pouringKey: string
  ) {
    report[pouringKey].total = 0;
    Object.keys(report[pouringKey]).forEach((key) => {
      if (key !== 'total') {
        report[pouringKey].total += report[pouringKey][key];
      }
    });
  }

  private calcBasicReportInRow(
    reportObject: ModelReportResponseInRow,
    // tslint:disable-next-line:no-shadowed-variable
    report: IReportResponse
  ) {
    if (!reportObject) {
      return;
    }
    reportObject.goldenHours += report.goldenHours;

    reportObject.regularPouring.uncontactable +=
      report.regularPouring.uncontactable;
    reportObject.regularPouring.notPickUp += report.regularPouring.notPickUp;
    reportObject.regularPouring.noNeed += report.regularPouring.noNeed;
    reportObject.regularPouring.hangUp += report.regularPouring.hangUp;
    reportObject.regularPouring.twoSentences +=
      report.regularPouring.twoSentences;
    reportObject.regularPouring.moreThanTwoSentences +=
      report.regularPouring.moreThanTwoSentences;
    reportObject.regularPouring.total += report.regularPouring.total;

    reportObject.selfPouring.uncontactable += report.selfPouring.uncontactable;
    reportObject.selfPouring.notPickUp += report.selfPouring.notPickUp;
    reportObject.selfPouring.noNeed += report.selfPouring.noNeed;
    reportObject.selfPouring.hangUp += report.selfPouring.hangUp;
    reportObject.selfPouring.twoSentences += report.selfPouring.twoSentences;
    reportObject.selfPouring.moreThanTwoSentences +=
      report.selfPouring.moreThanTwoSentences;
    reportObject.selfPouring.total += report.selfPouring.total;

    reportObject.pushCount += report.pushCount;
    reportObject.suggestionCount += report.suggestionCount;
    reportObject.emailCount += report.emailCount;
    reportObject.flirtingCount += report.flirtingCount;
  }

  private resetReportTotalFooter() {
    this.reportTotalFooter = new ModelReportResponseInRow();
  }

  private resetTeamsInTable() {
    Object.keys(this.mappingTeamsInTable).forEach((teamId) => {
      this.mappingTeamsInTable[teamId] = new ModelReportResponseInRow();
    });
  }

  private calcFooterRatingSources(reports: IReportResponse[]) {
    const sourcesFooter = {};
    const temp = cloneDeep(reports);
    // tslint:disable-next-line:no-shadowed-variable
    temp.forEach((report) => {
      Object.keys(report.ratingSources).forEach((sourceId) => {
        if (!sourcesFooter[sourceId]) {
          sourcesFooter[sourceId] = {
            1: {},
            2: {},
            4: {},
            8: {},
          };
        }
        const source = report.ratingSources;
        sourcesFooter[sourceId][1] = this.handleFooterTotalRating(
          source[sourceId][1],
          sourcesFooter[sourceId][1]
        );

        sourcesFooter[sourceId][2] = this.handleFooterTotalRating(
          source[sourceId][2],
          sourcesFooter[sourceId][2]
        );

        sourcesFooter[sourceId][4] = this.handleFooterTotalRating(
          source[sourceId][4],
          sourcesFooter[sourceId][4]
        );

        sourcesFooter[sourceId][8] = this.handleFooterTotalRating(
          source[sourceId][8],
          sourcesFooter[sourceId][8]
        );
      });
    });
    return sourcesFooter;
  }

  private handleFooterTotalRating(ratingObj, resultObj) {
    if (ratingObj) {
      Object.keys(ratingObj).forEach((ratingId) => {
        if (!resultObj[ratingId]) {
          resultObj[ratingId] = ratingObj[ratingId];
        } else {
          ratingObj[ratingId].forEach((item) => {
            const founded = resultObj[ratingId].find(
              (element) => element[0] === item[0]
            );
            if (founded) {
              founded[1] += item[1];
            } else {
              resultObj[ratingId].push(item);
            }
          });
        }
      });
    }
    return { ...resultObj };
  }

  private convertReportItemToExcelRow(
    report: ModelReportResponseInRow,
    customName: string = ''
  ) {
    const result = [];

    if (!customName) {
      if (report.isTeamRow) {
        result.push(report.reportUserName);
      } else {
        const nameArr = report.reportUserNameTooltip.split(' ');
        nameArr.push(nameArr.shift());
        result.push(nameArr.join(' '));
      }
    } else {
      result.push(customName);
    }

    result.push(report.goldenHours);

    result.push(report.regularPouring.uncontactable);
    result.push(report.regularPouring.notPickUp);
    result.push(report.regularPouring.noNeed);
    result.push(report.regularPouring.hangUp);
    result.push(report.regularPouring.twoSentences);
    result.push(report.regularPouring.moreThanTwoSentences);
    result.push(report.regularPouring.total);

    result.push(report.selfPouring.uncontactable);
    result.push(report.selfPouring.notPickUp);
    result.push(report.selfPouring.noNeed);
    result.push(report.selfPouring.hangUp);
    result.push(report.selfPouring.twoSentences);
    result.push(report.selfPouring.moreThanTwoSentences);
    result.push(report.selfPouring.total);

    result.push(report.pushCount);
    result.push(report.suggestionCount);
    result.push(report.emailCount);
    result.push(report.flirtingCount);

    return {
      isTeamRow: report.isTeamRow,
      result,
    };
  }

  exportReportToExcel() {
    const sourceHeadersList = this.sourcesList.filter(
      (source) => source.showColumn
    );

    let sourceExcelRows = [];

    this.ratingsSourceElements.forEach((item) => {
      if (item.isTeamRow === false) {
        return;
      }
      const data = item.getHandledRatingsData();
      let index = -1;
      if (item.isTeamRow) {
        index = sourceExcelRows.findIndex((ele) => ele.teamId === data.teamId);
      } else {
        index = sourceExcelRows.findIndex(
          (ele) => ele.reportUserId === data.reportUserId
        );
      }
      if (index > -1) {
        sourceExcelRows[index].ratingsData = sourceExcelRows[
          index
        ].ratingsData.concat(data.ratingsData);
      } else {
        sourceExcelRows.push(data);
      }
    });

    console.log({ ...sourceExcelRows });

    sourceExcelRows = sourceExcelRows.map((item) => item.ratingsData);

    const handledReportsData = [];
    const teamsIndex = [];
    this.reportsData.forEach((report, index) => {
      const { isTeamRow, result } = this.convertReportItemToExcelRow(report);
      if (isTeamRow) {
        teamsIndex.push(index);
      }
      handledReportsData.push(result);
    });

    const dataForExcel = [];
    handledReportsData.forEach((row: any) => {
      dataForExcel.push(Object.values(row));
    });
    const dateRange = `${Utils.DateTime.convertDateStringDDMMYYYY(
      this.startDate
    )} - ${Utils.DateTime.convertDateStringDDMMYYYY(this.endDate)}`;

    let totalRatings = [];
    this.ratingsSourceFooter.forEach((item) => {
      totalRatings = totalRatings.concat(
        item.getHandledRatingsData().ratingsData
      );
    });

    const reportData = {
      title: `Report -- ${dateRange}`,
      data: dataForExcel,
      sourceHeaders: sourceHeadersList,
      sourceExcelRows,
      reportTotalData: this.convertReportItemToExcelRow(
        this.reportTotalFooter,
        'TỔNG'
      ).result,
      reportTotalSourcesData: totalRatings,
      teamsIndex,
    };

    console.log(reportData);
    console.log(this.reportsData);

    this.exportReportExcelService.exportExcel(reportData);
  }
}
