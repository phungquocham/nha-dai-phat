import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewEncapsulation, OnDestroy, Inject, ViewChild } from '@angular/core';
import { DialogService } from 'src/app/shared/services/others/dialog.service';
import { ReportsService } from 'src/app/shared/services/api/reports.service';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SourcesService } from 'src/app/shared/services/api/sources.service';
import { ProjectsService } from 'src/app/shared/services/api/projects.service';
import { RatingsService } from 'src/app/shared/services/api/ratings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/shared/helpers/utilities';
import { TeamsService } from 'src/app/shared/services/api/teams.service';
import { UsersService } from 'src/app/shared/services/api/users.service';
import { Routing } from 'src/app/shared/helpers/routing';
import { PageLoadingService } from 'src/app/shared/services/others/page-loading.service';
import { isString, isNumber } from 'util';
import { IReportQueryParams, IReportResponse, ModelReportRatingHandle, ModelReportResponseInRow, ReportQueryParams } from './reports.model';
import { DialogReportsSelectOptionsComponent } from './dialogs/dialog-reports-select-options/dialog-reports-select-options.component';
import {
  CustomSelectAutocompleteComponent
} from 'src/app/shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.component';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportsComponent implements OnInit, AfterViewInit, OnDestroy {

  static BUFFER_SIZE = 3;

  @ViewChild('selectUsersElement', {static: false}) selectUsersElement: CustomSelectAutocompleteComponent;
  @ViewChild('selectTeamsElement', {static: false}) selectTeamsElement: CustomSelectAutocompleteComponent;
  @ViewChild('selectSourcesElement', {static: false}) selectSourcesElement: CustomSelectAutocompleteComponent;
  @ViewChild('selectProjectsElement', {static: false}) selectProjectsElement: CustomSelectAutocompleteComponent;

  private ngUnsubscribe = new Subject();
  private reportsTableMap = new Map();
  private sourcesColumnsInTableMap = new Map();
  private TOTAL = {
    GOLDEN_HOURS: 'totalGoldenHours',
    SELF_POURING: {
      UNCONTACTABLE: 'total_self_uncontactable',
      NOT_PICK_UP: 'total_self_notPickUp',
      NO_NEED: 'total_self_noNeed',
      HANG_UP: 'total_self_hangUp',
      TWO_SENTENCES: 'total_self_twoSentences',
      MORE_THAN_TWO_SENTENCES: 'total_self_moreThanTwoSentences'
    },
    REGULAR_POURING: {
      UNCONTACTABLE: 'total_regular_uncontactable',
      NOT_PICK_UP: 'total_regular_notPickUp',
      NO_NEED: 'total_regular_noNeed',
      HANG_UP: 'total_regular_hangUp',
      TWO_SENTENCES: 'total_regular_twoSentences',
      MORE_THAN_TWO_SENTENCES: 'total_regular_moreThanTwoSentences'
    },
    PUSH_COUNT: 'total_pushCount',
    SUGGESSTION_COUNT: 'total_suggesstionCount',
    EMAIL_COUNT: 'total_emailCount',
    FLIRTING_COUNT: 'total_flirtingCount'
  };

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

  totalGoldenHours = 0;
  totalSelfPouringUncontactable = 0;
  totalSelfPouringNotPickUp = 0;
  totalSelfPouringNoNeed = 0;
  totalSelfPouringHangUp = 0;
  totalSelfPouringTwoSentences = 0;
  totalSelfPouringMoreThanTwoSentences = 0;
  totalAllSelfPouring = 0;
  totalRegularPouringUncontactable = 0;
  totalRegularPouringNotPickUp = 0;
  totalRegularPouringNoNeed = 0;
  totalRegularPouringHangUp = 0;
  totalRegularPouringTwoSentences = 0;
  totalRegularPouringMoreThanTwoSentences = 0;
  totalAllRegularPouring = 0;
  totalPushCount = 0;
  totalEmailCount = 0;
  totalSuggesstionCount = 0;
  totalFlirtingCount = 0;
  totalSourcesPour = {};
  totalSourcesPush = {};
  totalSourcesOthers = {};
  pourKeys = [];
  pushKeys = [];
  otherKeys = [];
  totalRatingSourcesByColumn = {};
  totalRatingPointsByColumn = 0;

  private previousQueryParams = new ReportQueryParams();

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
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    forkJoin(
      this.sourcesService.getList(),
      this.projectsService.getList(),
      this.teamsService.getList(),
      this.usersService.getUserNamesList(),
      this.ratingsService.getRatingNamesList(),
    ).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {

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
      this.sourcesList.push({ id: 0, name: 'TỔNG NGUỒN', column: 'column0', color: 'goldenrod' });
      res[0].forEach((item, index) => {
        item.column = 'column' + (index + 1);
        keys.push(item.column);
        this.sourcesList.push(item);
      });
      // keys.push('totalRatingPoints');
      this.displayedColumnsReport = keys;
      this.sourcesList.forEach(item => {
        const obj = {
          id: item.id,
          name: item.name,
          showColumn: item.showColumn
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
    this.dialog.open({
      component: DialogReportsSelectOptionsComponent,
      data: {
        projectsList: this.projectsList,
        teamsList: this.teamsList,
        usersList: this.usersList,
        sourcesColumnsList: this.sourcesColumnsList
      }
    }).subscribe(res => {
      if (res) {
        console.log(res);
        this.routeWithQueryParams({
          fromDate: res.startDate,
          toDate: res.endDate,
          projects: Utils.joinArray(res.projectsSelected, ','),
          teams: Utils.joinArray(res.teamsSelected, ','),
          users: Utils.joinArray(res.usersSelected, ','),
          sources: Utils.joinArray(res.sourcesColumnsSelected, ',')
        });
      }
    });
  }

  private subscribePageLoading() {
    this.pageLoadingService.loading$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any[]) => {
      (res.length > 0) ? (this.isLoading = true) : (this.isLoading = false);
      this.detechChanges();
    });
  }

  private subscribeQueryParams() {
    this.route.queryParams.subscribe((queryParams: IReportQueryParams) => {
      this.isLoading = true;
      if (queryParams.fromDate) {
        this.startDate = Utils.DateTime.convertDateTimeDDMMYYYY(queryParams.fromDate);
      }
      if (queryParams.toDate) {
        this.endDate = Utils.DateTime.convertDateTimeDDMMYYYY(queryParams.toDate);
      }
      if (queryParams.projects) {
        this.projectsSelected = queryParams.projects.split(',').map(i => parseInt(i, 10));
        this.selectProjectsElement.setSelectedDataBaseOnValue(this.projectsSelected);
      }
      if (queryParams.teams) {
        this.teamsSelected = queryParams.teams.split(',').map(i => parseInt(i, 10));
        this.selectTeamsElement.setSelectedDataBaseOnValue(this.teamsSelected);
        this.showTeamRows = true;
      } else {
        this.showTeamRows = false;
      }
      if (queryParams.users) {
        this.usersSelected = queryParams.users.split(',').map(i => parseInt(i, 10));
        this.selectUsersElement.setSelectedDataBaseOnValue(this.usersSelected);
      }
      if (queryParams.sources) {
        this.sourcesSelected = queryParams.sources.split(',').map(i => parseInt(i, 10));
        this.selectSourcesElement.setSelectedDataBaseOnValue(this.sourcesSelected);
        this.sourcesList.forEach(item => {
          if (this.sourcesSelected.findIndex(selectedId => selectedId === item.id) > -1) {
            item.showColumn = true;
          } else {
            item.showColumn = false;
          }
        });
      } else {
        this.sourcesList.forEach(item => {
          item.showColumn = false;
        });
      }
      this.previousQueryParams.setData(queryParams);
      this.detechChanges();
      this.getReportsList(queryParams);
    });
  }

  private handleTotalRatingSourcesByColumn(data: {
    ratingSourcessByTeam: any[],
    sourcesList: any[],
    projectsList: any[],
    pourKeys: number[],
    pushKeys: number[],
    othersKeys: number[]
  }) {
    if (data && data.ratingSourcessByTeam) {
      // const temp = {};
      // Object.keys(data.ratingSourcessByTeam).forEach(sourceId => {
      //   temp[sourceId] = data.ratingSourcessByTeam[sourceId];
      // });
      Object.keys(data.ratingSourcessByTeam).forEach(sourceId => {
        const item = data.ratingSourcessByTeam[sourceId];
        item['pour'] = [];
        item['push'] = [];
        item['others'] = [];
        data.pourKeys.forEach(ratingId => {
          const rating = new ModelReportRatingHandle(),
            { id, name, color } = this.getRatingFromList(ratingId),
            { tooltip, total } = this.getProjectTooltipFromList(item[1][ratingId]);
          rating.id = id;
          rating.name = name;
          rating.color = color;
          rating.tooltip = tooltip;
          rating.total = total;
          item['pour'].push(rating);
        });
        data.pushKeys.forEach(ratingId => {
          const rating = new ModelReportRatingHandle(),
            { id, name, color } = this.getRatingFromList(ratingId),
            { tooltip, total } = this.getProjectTooltipFromList(item[2][ratingId]);
          rating.id = id;
          rating.name = name;
          rating.color = color;
          rating.tooltip = tooltip;
          rating.total = total;
          item['push'].push(rating);
        });
        data.othersKeys.forEach(ratingId => {
          const rating = new ModelReportRatingHandle(),
            { id, name, color } = this.getRatingFromList(ratingId),
            { tooltip, total } = this.getProjectTooltipFromList(item[4][ratingId]);
          rating.id = id;
          rating.name = name;
          rating.color = color;
          rating.tooltip = tooltip;
          rating.total = total;
          item['others'].push(rating);
        });
      });
    }
    return data.ratingSourcessByTeam;
  }

  private getReportsList(queryParams: any) {
    this.reportsService
      .aggregateReports({
        query: queryParams,
        sourcesList: this.sourcesList,
        teamsList: this.teamsList,
        ratingsList: this.ratingsList
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        const { pourIds, pushIds, othersIds } = ReportsService.GetReportTypesList(this.ratingsList);
        this.pourKeys = pourIds;
        this.pushKeys = pushIds;
        this.otherKeys = othersIds;
        const res: IReportResponse[] = data.reportsData;
        this.totalRatingSourcesByColumn = this.handleTotalRatingSourcesByColumn({
          ratingSourcessByTeam: data.totalRatingResourcesByColumn,
          sourcesList: this.sourcesList,
          projectsList: this.projectsList,
          pourKeys: this.pourKeys,
          pushKeys: this.pushKeys,
          othersKeys: this.otherKeys
        });
        // console.log(this.totalRatingSourcesByColumn);
        this.resetTotalColumns();
        this.sourcesColumnsInTableMap.clear();
        this.totalSourcesPour = {};
        this.totalSourcesPush = {};
        this.totalSourcesOthers = {};
        res.forEach((report) => {
          if (isNumber(report.reportUserId)) {
            this.calculateColumnInTable(this.TOTAL.GOLDEN_HOURS, report.goldenHours);
            this.calculateColumnInTable(this.TOTAL.SELF_POURING.UNCONTACTABLE, report.selfPouring.uncontactable);
            this.calculateColumnInTable(this.TOTAL.SELF_POURING.NOT_PICK_UP, report.selfPouring.notPickUp);
            this.calculateColumnInTable(this.TOTAL.SELF_POURING.NO_NEED, report.selfPouring.noNeed);
            this.calculateColumnInTable(this.TOTAL.SELF_POURING.HANG_UP, report.selfPouring.hangUp);
            this.calculateColumnInTable(this.TOTAL.SELF_POURING.TWO_SENTENCES, report.selfPouring.twoSentences);
            this.calculateColumnInTable(this.TOTAL.SELF_POURING.MORE_THAN_TWO_SENTENCES, report.selfPouring.moreThanTwoSentences);

            this.calculateColumnInTable(this.TOTAL.REGULAR_POURING.UNCONTACTABLE, report.regularPouring.uncontactable);
            this.calculateColumnInTable(this.TOTAL.REGULAR_POURING.NOT_PICK_UP, report.regularPouring.notPickUp);
            this.calculateColumnInTable(this.TOTAL.REGULAR_POURING.NO_NEED, report.regularPouring.noNeed);
            this.calculateColumnInTable(this.TOTAL.REGULAR_POURING.HANG_UP, report.regularPouring.hangUp);
            this.calculateColumnInTable(this.TOTAL.REGULAR_POURING.TWO_SENTENCES, report.regularPouring.twoSentences);
            this.calculateColumnInTable(this.TOTAL.REGULAR_POURING.MORE_THAN_TWO_SENTENCES, report.regularPouring.moreThanTwoSentences);

            this.calculateColumnInTable(this.TOTAL.PUSH_COUNT, report.pushCount);
            this.calculateColumnInTable(this.TOTAL.SUGGESSTION_COUNT, report.suggestionCount);
            this.calculateColumnInTable(this.TOTAL.EMAIL_COUNT, report.emailCount);
            this.calculateColumnInTable(this.TOTAL.FLIRTING_COUNT, report.flirtingCount);
          }
          let isCalculateRatingPoints = true;
          this.sourcesList.forEach(source => {
            let pourObj = {},
              pushObj = {},
              othersObj = {};
            if (report.ratingSources && report.ratingSources[source.id]) {
              pourObj = report.ratingSources[source.id][1];
              pushObj = report.ratingSources[source.id][2];
              othersObj = report.ratingSources[source.id][4];
              const { data: pourHandledData, totalRatingPoints: pourRatingPoints } = this.handleRatingGroups(report.reportUserId, source.id, pourObj, 'pour'),
              { data: pushHandledData, totalRatingPoints: pushRatingPoints } = this.handleRatingGroups(report.reportUserId, source.id, pushObj, 'push'),
              { data: othersHandledData, totalRatingPoints: othersRatingPoints } = this.handleRatingGroups(report.reportUserId, source.id, othersObj, 'others');

              // report.ratingSources[source.id]['pour'] = this.handleRatingGroups(report.reportUserId, source.id, pourObj, 'pour');
              // report.ratingSources[source.id]['push'] = this.handleRatingGroups(report.reportUserId, source.id, pushObj, 'push');
              // report.ratingSources[source.id]['others'] = this.handleRatingGroups(report.reportUserId, source.id, othersObj, 'others');

              report.ratingSources[source.id]['pour'] = pourHandledData;
              report.ratingSources[source.id]['push'] = pushHandledData;
              report.ratingSources[source.id]['others'] = othersHandledData;
              if (isCalculateRatingPoints) {
                report.totalRatingPoints = pourRatingPoints + pushRatingPoints + othersRatingPoints;
                isCalculateRatingPoints = false;
                if (isString(report.reportUserId)) {
                  this.totalRatingPointsByColumn += report.totalRatingPoints;
                }
              }
            }
          });

          if (isNumber(report.reportUserId)) {
            this.sourcesList.forEach(source => {
              this.totalSourcesPour[source.id] = {
                pour: []
              };
              this.totalSourcesPush[source.id] = {
                push: []
              };
              this.totalSourcesOthers[source.id] = {
                others: []
              };
              this.pourKeys.forEach(key => {
                const keyMap = `${source.id}_pour_${key}`;
                if (this.sourcesColumnsInTableMap.get(keyMap)) {
                  this.totalSourcesPour[source.id].pour
                    .push(this.sourcesColumnsInTableMap.get(keyMap).pour);
                }
              });
              this.pushKeys.forEach(key => {
                const keyMap = `${source.id}_push_${key}`;
                if (this.sourcesColumnsInTableMap.get(keyMap)) {
                  this.totalSourcesPush[source.id].push
                    .push(this.sourcesColumnsInTableMap.get(keyMap).push);
                }
              });
              this.otherKeys.forEach(key => {
                const keyMap = `${source.id}_others_${key}`;
                if (this.sourcesColumnsInTableMap.get(keyMap)) {
                  this.totalSourcesOthers[source.id].others
                    .push(this.sourcesColumnsInTableMap.get(keyMap).others);
                }
              });

            });
          }

        });

        this.reportsData = res;
        this.totalGoldenHours = this.getTotalColumnInTable(this.TOTAL.GOLDEN_HOURS);
        this.totalSelfPouringUncontactable = this.getTotalColumnInTable(this.TOTAL.SELF_POURING.UNCONTACTABLE);
        this.totalSelfPouringNotPickUp = this.getTotalColumnInTable(this.TOTAL.SELF_POURING.NOT_PICK_UP);
        this.totalSelfPouringNoNeed = this.getTotalColumnInTable(this.TOTAL.SELF_POURING.NO_NEED);
        this.totalSelfPouringHangUp = this.getTotalColumnInTable(this.TOTAL.SELF_POURING.HANG_UP);
        this.totalSelfPouringTwoSentences = this.getTotalColumnInTable(this.TOTAL.SELF_POURING.TWO_SENTENCES);
        this.totalSelfPouringMoreThanTwoSentences = this.getTotalColumnInTable(this.TOTAL.SELF_POURING.MORE_THAN_TWO_SENTENCES);
        this.totalAllSelfPouring = this.totalSelfPouringUncontactable + this.totalSelfPouringNotPickUp + this.totalSelfPouringNoNeed +
          this.totalSelfPouringHangUp + this.totalSelfPouringTwoSentences + this.totalSelfPouringMoreThanTwoSentences;
        this.totalRegularPouringUncontactable = this.getTotalColumnInTable(this.TOTAL.REGULAR_POURING.UNCONTACTABLE);
        this.totalRegularPouringNotPickUp = this.getTotalColumnInTable(this.TOTAL.REGULAR_POURING.NOT_PICK_UP);
        this.totalRegularPouringNoNeed = this.getTotalColumnInTable(this.TOTAL.REGULAR_POURING.NO_NEED);
        this.totalRegularPouringHangUp = this.getTotalColumnInTable(this.TOTAL.REGULAR_POURING.HANG_UP);
        this.totalRegularPouringTwoSentences = this.getTotalColumnInTable(this.TOTAL.REGULAR_POURING.TWO_SENTENCES);
        this.totalRegularPouringMoreThanTwoSentences = this.getTotalColumnInTable(this.TOTAL.REGULAR_POURING.MORE_THAN_TWO_SENTENCES);
        this.totalAllRegularPouring = this.totalRegularPouringUncontactable + this.totalRegularPouringNotPickUp +
          this.totalRegularPouringNoNeed + this.totalRegularPouringHangUp + this.totalRegularPouringTwoSentences +
          this.totalRegularPouringMoreThanTwoSentences;
        this.totalPushCount = this.getTotalColumnInTable(this.TOTAL.PUSH_COUNT);
        this.totalSuggesstionCount = this.getTotalColumnInTable(this.TOTAL.SUGGESSTION_COUNT);
        this.totalEmailCount = this.getTotalColumnInTable(this.TOTAL.EMAIL_COUNT);
        this.totalFlirtingCount = this.getTotalColumnInTable(this.TOTAL.FLIRTING_COUNT);
        // console.log(this.reportsData);
        this.detechChanges();
      });
  }

  private resetTotalColumns() {
    this.reportsTableMap.set(this.TOTAL.GOLDEN_HOURS, 0);
    this.reportsTableMap.set(this.TOTAL.SELF_POURING.UNCONTACTABLE, 0);
    this.reportsTableMap.set(this.TOTAL.SELF_POURING.NOT_PICK_UP, 0);
    this.reportsTableMap.set(this.TOTAL.SELF_POURING.NO_NEED, 0);
    this.reportsTableMap.set(this.TOTAL.SELF_POURING.HANG_UP, 0);
    this.reportsTableMap.set(this.TOTAL.SELF_POURING.TWO_SENTENCES, 0);
    this.reportsTableMap.set(this.TOTAL.SELF_POURING.MORE_THAN_TWO_SENTENCES, 0);
    this.reportsTableMap.set(this.TOTAL.REGULAR_POURING.UNCONTACTABLE, 0);
    this.reportsTableMap.set(this.TOTAL.REGULAR_POURING.NOT_PICK_UP, 0);
    this.reportsTableMap.set(this.TOTAL.REGULAR_POURING.NO_NEED, 0);
    this.reportsTableMap.set(this.TOTAL.REGULAR_POURING.HANG_UP, 0);
    this.reportsTableMap.set(this.TOTAL.REGULAR_POURING.TWO_SENTENCES, 0);
    this.reportsTableMap.set(this.TOTAL.REGULAR_POURING.MORE_THAN_TWO_SENTENCES, 0);
    this.reportsTableMap.set(this.TOTAL.PUSH_COUNT, 0);
    this.reportsTableMap.set(this.TOTAL.SUGGESSTION_COUNT, 0);
    this.reportsTableMap.set(this.TOTAL.EMAIL_COUNT, 0);
    this.reportsTableMap.set(this.TOTAL.FLIRTING_COUNT, 0);
    this.totalRatingPointsByColumn = 0;
  }

  private calculateColumnInTable(key: string, value: number) {
    const total = this.reportsTableMap.get(key);
    this.reportsTableMap.set(key, (total ? total : 0) + value);
  }

  private getTotalColumnInTable(key: string) {
    return this.reportsTableMap.get(key);
  }

  private handleRatingGroups(reportId: any, sourceId: any, groups: any, type?: string): any {
    const result = [];
    let totalRatingPoints = 0;
    // console.log(groups);
    Object.keys(groups).forEach(ratingId => {
      const rating = new ModelReportRatingHandle(),
        { id, name, color, points } = this.getRatingFromList(ratingId),
        { tooltip, total } = this.getProjectTooltipFromList(groups[ratingId]);
      rating.id = id;
      rating.name = name;
      rating.color = color;
      rating.tooltip = tooltip;
      rating.total = total;
      rating.totalRatingPoints = total * points;
      rating.tooltipsList = groups[ratingId];
      result.push(rating);
      totalRatingPoints += rating.totalRatingPoints;
      let temp = 0;
      let key = '';
      let tempList = [];
      if (isString(reportId)) {
        key = `report_${reportId}_${type}_${rating.id}`;
      } else {
        key = `${sourceId}_${type}_${rating.id}`;
      }
      if (this.sourcesColumnsInTableMap.get(key) && this.sourcesColumnsInTableMap.get(key)[type]) {
        temp = this.sourcesColumnsInTableMap.get(key)[type]['total'];
        tempList = this.sourcesColumnsInTableMap.get(key)[type]['tooltipsList'] || [];
      }
      const tempData = {
        tooltip: tooltip,
        tooltipsList: [],
        name: rating.name,
        color: rating.color,
        total: temp + rating.total,
        id: rating.id
      };
      if (isString(reportId)) {
        if (tempList.length === 0) {
          rating.tooltipsList.forEach(item => {
            tempList.push(item);
          });
        }
        tempData['tooltipsList'] = tempList;
      }
      if (type === 'pour') {
        this.sourcesColumnsInTableMap.set(key, {
          pour: tempData,
        });
      } else if (type === 'push') {
        this.sourcesColumnsInTableMap.set(key, {
          push: tempData,
        });
      } else if (type === 'others') {
        this.sourcesColumnsInTableMap.set(key, {
          others: tempData,
        });
      }
    });
    // return result;
    return {
      data: result,
      totalRatingPoints: totalRatingPoints
    };
  }

  private getRatingFromList(id: any) {
    const founded = this.ratingsList.find(item => id === '_' + item.id);
    if (founded) {
      return founded;
    }
    return {
      id: 0,
      name: '',
      color: ''
    };
  }

  private getProjectTooltipFromList(data: any[]) {
    if (!data) {
      return;
    }
    const result = [];
    let total = 0;
    data.forEach(item => {
      if (item[0] === 0) {
        result.push(`${item[1]}`);
        total += item[1];
      } else {
        const founded = this.projectsList.find(project => project.id === item[0]);
        if (founded) {
          result.push(`${founded.name}: ${item[1]}`);
          total += item[1];
        }
      }
    });
    return {
      tooltip: result.join('\n'),
      total: total
    };
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
        sources: Utils.joinArray(this.sourcesSelected, ',')
      });
    }, 50);
  }

  private routeWithQueryParams(queryParams: IReportQueryParams) {
    console.log(queryParams);
    this.router.navigate([Routing.REPORTS], { queryParams: queryParams });
  }

}
