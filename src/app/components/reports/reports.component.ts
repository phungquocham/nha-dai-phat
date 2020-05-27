import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ViewEncapsulation,
  OnDestroy,
  Inject,
  ViewChild,
} from '@angular/core';
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
import { IReportQueryParams, ReportQueryParams } from './reports.model';
import { DialogReportsSelectOptionsComponent } from './dialogs/dialog-reports-select-options/dialog-reports-select-options.component';
import { CustomSelectAutocompleteComponent } from 'src/app/shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.component';
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
  reportsRawData = [];

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
          color: 'goldenrod',
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
        console.log('***************************');
        this.mappingSources = this.mappingObjectFromList(this.sourcesList);
        this.mappingProjects = this.mappingObjectFromList(this.projectsList);
        this.mappingRatings = this.mappingObjectFromList(this.ratingsList);
        console.log('***************************');
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
          console.log(res);
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
        console.log('111111');
        console.log(this.sourcesList, this.teamsList, this.ratingsList);
        console.log('111111');
        console.log('HHHHHHHHHHHHHHHHHHH', data);
        this.reportsData = data;
        this.handledReports(this.reportsData);
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

  mappingObjectFromList(list: any[], key = 'id') {
    const obj = {};
    list.forEach((item) => {
      obj[item[key]] = item;
    });
    return obj;
  }

  handledReports(reports: any[]) {
    reports.forEach((report) => {
      report.reportUserNameTooltip = report.reportUserName;
    });
  }
}
