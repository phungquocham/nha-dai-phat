import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { DailyReportService } from '../../shared/services/api/daily-reports.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Routing } from '../../shared/helpers/routing';
import {
  displayedColumns,
  filterData,
  setDate,
  splitNames,
} from './daily-reports.model';
import { QueryEvents } from '../../shared/helpers/query-url';
import { Utils } from '../../shared/helpers/utilities';
import { UserProfile } from '../../shared/models/user.profile.namespace';
import { SnackbarService } from '../../shared/services/others/snackbar.service';
import { TeamsService } from '../../shared/services/api/teams.service';
import { UsersService } from '../../shared/services/api/users.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { PagingEvents } from '../../shared/helpers/pagingevent';
import { forkJoin, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/app/shared/services/others/dialog.service';
import { DialogUserComponent } from './dialogs/dialog-user/dialog-user.component';
import { DialogReportsSearchComponent } from './dialogs/dialog-reports-search/dialog-reports-search.component';
import { CustomSelectAutocompleteComponent } from '../../shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.component';

@Component({
  selector: 'app-daily-reports',
  templateUrl: './daily-reports.component.html',
  styleUrls: ['./daily-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DailyReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('bottomPaginator', { static: true }) bottomPaginator: MatPaginator;
  ngUnsubscribe = new Subject();
  columns = [];
  filterData = { ...filterData };
  dataSource = [];
  permission = '';
  templateSources = [];
  //
  ratingPourings = [];
  ratingPushings = [];
  ratingHints = [];
  ratingOthers = [];
  dataProject = [];
  //
  fromDate = new Date();
  toDate = new Date();
  teamSelected = [];
  teamList = [];
  usersSelected = [];
  usersList = [];
  sourcesSelected = [];
  sourcesList = [];
  //
  isLoading = false;
  isLoadingResults = true;
  totalCount = 0;
  latestRatings = [];
  @ViewChild('selectTeams')
  selectTeams: CustomSelectAutocompleteComponent;
  @ViewChild('selectUsers')
  selectUsers: CustomSelectAutocompleteComponent;
  @ViewChild('selectSources')
  selectSources: CustomSelectAutocompleteComponent;

  constructor(
    private dailyReportService: DailyReportService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private snackbar: SnackbarService,
    private teamService: TeamsService,
    private usersService: UsersService,
    private dialog: DialogService
  ) {}

  ngOnInit() {
    this.reloadPage();
    this.getInit();
    this.checkPermission();
  }

  ngAfterViewInit() {
    if (this.permission === ('Administrator' || 'Manager')) {
      this.getGroup();
      this.getTeam();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getInit() {
    return forkJoin(
      this.dailyReportService.getSourceName().pipe(first()),
      this.dailyReportService.getRatingName().pipe(first()),
      this.dailyReportService.getProjectName().pipe(first()),
      this.activatedRoute.queryParams.pipe(first())
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        this.sourcesList = response[0];
        this.sourcesSelected = (response[3].sources || '')
          .split(',')
          .map((i) => Number(i))
          .filter((i) => i > 0);
        this.setSource();
        //
        this.createTemplateSource(response[0]);
        this.createColumns();
        //
        this.ratingPourings = response[1].pourings;
        this.ratingPushings = response[1].pushings;
        this.ratingOthers = response[1].others;
        this.latestRatings = response[1].total;
        this.ratingHints = this.latestRatings.filter(
          // tslint:disable-next-line:no-bitwise
          (item) => (item.types & 8) !== 0
        );
        //
        this.dataProject = response[2];
        this.renderRatingSources();
      });
  }

  createTemplateSource(arr: any[]) {
    this.templateSources = [];
    this.sourcesSelected.filter((x) => {
      const filter = arr.find((s) => s.id === x);
      if (filter) {
        this.templateSources.push(filter);
      }
    });
  }

  createColumns() {
    const tempColumn = [];
    this.templateSources.forEach((element, index) => {
      const column = { column: 'column' + element.id, index: 12 + index };
      const filter = tempColumn.find((c) => c.column === column.column);
      if (!filter) {
        tempColumn.push(column);
      }
    });
    this.columns = Utils.sortIndex(displayedColumns.concat(tempColumn)).map(
      (item) => item.column
    );
    this.templateSources.forEach((element) => {
      element['column'] = 'column' + element.id;
    });
  }

  checkPermission() {
    this.permission = UserProfile.getRole();
  }

  setQueryString(params: Params) {
    const { fromDate, fromDateString, toDate, toDateString } = setDate(params);
    this.fromDate = fromDate;
    this.filterData.fromDate = fromDateString;
    this.toDate = toDate;
    this.filterData.toDate = toDateString;
    //
    if (params.teams) {
      this.teamSelected = (params.teams || '')
        .split(',')
        .map((i) => Number(i))
        .filter((i) => i > 0);
    } else {
      this.teamSelected = [];
    }
    this.filterData.teams = this.teamSelected
      .map((i) => Number(i))
      .filter((i) => i)
      .join(',');
    this.setGroup();
    //
    if (params.users) {
      this.usersSelected = (params.users || '')
        .split(',')
        .map((i) => Number(i))
        .filter((i) => i > 0);
    } else {
      this.usersSelected = [];
    }
    this.filterData.users = this.usersSelected
      .map((i) => Number(i))
      .filter((i) => i)
      .join(',');
    this.setTeam();
    //
    if (params.sources) {
      this.sourcesSelected = (params.sources || '')
        .split(',')
        .map((i) => Number(i))
        .filter((i) => i > 0);
    } else {
      this.sourcesSelected = [];
    }
    this.filterData.sources = this.sourcesSelected
      .map((i) => Number(i))
      .filter((i) => i)
      .join(',');
    this.setSource();
  }

  initialFilter() {
    this.filterData = { ...filterData };
  }

  getGroup() {
    this.teamService
      .getTeamName()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.teamList = res || [];
        this.setGroup();
      });
  }

  setGroup() {
    if (this.teamList.length > 0) {
      this.selectTeams.setData(this.teamList);
      this.selectTeams.setSelectedDataBaseOnValue(this.teamSelected);
    }
  }

  getTeam() {
    this.usersService
      .getUserName()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.usersList = res;
        this.selectUsers.setData(this.usersList);
        this.selectUsers.setSelectedDataBaseOnValue(this.usersSelected);
      });
  }

  setTeam() {
    if (this.usersList.length > 0) {
      this.selectUsers.setData(this.usersList);
      this.selectUsers.setSelectedDataBaseOnValue(this.usersSelected);
    }
  }

  setSource() {
    if (this.sourcesList.length > 0) {
      this.selectSources.setData(this.sourcesList);
      this.selectSources.setSelectedDataBaseOnValue(this.sourcesSelected);
    }
  }

  reloadPage() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.initialFilter();
      this.setQueryString(params);
      this.filterData = QueryEvents.setQuery(this.filterData, params);
      this.createTemplateSource(this.sourcesList);
      this.createColumns();
      const event = new PageEvent();
      event.pageIndex = this.filterData.page - 1;
      event.pageSize = this.filterData.pageSize;
      this.setPaging(event, 'reload');
      this.getList();
    });
  }

  onPagingEvent(event?: PageEvent) {
    this.setPaging(event);
    this.routeRedirect();
  }

  setPaging(event, router = null) {
    const item = new PagingEvents().init(
      event,
      router,
      this.filterData.pageSize
    );
    this.filterData.page = item.page;
    this.filterData.pageSize = item.pageSize;
    this.bottomPaginator.pageSize = item.pageSize;
    this.bottomPaginator.pageIndex = item.pageIndex;
  }

  routeRedirect() {
    this.router.navigateByUrl(
      `${Routing.DAILYREPORTS}${Utils.encodeQueryData(this.filterData)}`
    );
  }

  getList() {
    this.dataSource = [];
    this.isLoadingResults = true;
    this.isLoading = true;

    this.dailyReportService
      .getList(this.filterData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        response.items.forEach((element) => {
          element.reportDate = Utils.transform(element.reportDate);
          element.reportUserNameTooltip = element.reportUserName;
          element.reportUserName = splitNames(element.reportUserName);
          if (
            Utils.getTimestamp() - element.createdAt > 86400 &&
            this.permission === 'Sales'
          ) {
            element.createdAt = false;
          } else {
            element.createdAt = true;
          }
        });
        this.dataSource = response.items;
        this.totalCount = response.totalCount;
        this.isLoadingResults = false;
        this.isLoading = false;
        this.renderRatingSources();
      });
  }

  onAddDailyReport() {
    if (this.permission === ('Administrator' || 'Manager')) {
      this.openDialogUser();
    } else {
      this.getReportDate();
    }
  }

  getReportDate(reportUserId = 0) {
    this.dailyReportService
      .getReportDate(reportUserId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        if (Number(response.reportDate) === 0) {
          this.snackbar.open({
            message: 'Không thêm được ghi nhận',
            type: 'SUCCESS',
          });
        } else {
          if (reportUserId) {
            this.router.navigateByUrl(
              `${Routing.DAILYREPORTS}/${Routing.NEW}?reportUserId=${reportUserId}`
            );
          } else {
            this.router.navigateByUrl(`${Routing.DAILYREPORTS}/${Routing.NEW}`);
          }
        }
      });
  }

  onEdit(id: any) {
    this.router.navigateByUrl(`${Routing.DAILYREPORTS}/${id}`);
  }

  search() {
    this.filterData.page = 1;
    this.filterData.fromDate = Utils.convertDateString(this.fromDate);
    this.filterData.toDate = Utils.convertDateString(this.toDate);
    this.filterData.teams = this.teamSelected
      .map((i) => Number(i))
      .filter((i) => i)
      .join(',');
    this.filterData.users = this.usersSelected
      .map((i) => Number(i))
      .filter((i) => i)
      .join(',');
    this.filterData.sources = this.sourcesSelected
      .map((i) => Number(i))
      .filter((i) => i)
      .join(',');
    this.routeRedirect();
  }

  renderRatingSources() {
    if (this.dataSource.length > 0 && this.latestRatings.length > 0) {
      this.dataSource.map((items) => {
        this.templateSources.map((source) => {
          const ratings = {
            ratingPourings: [],
            ratingPushings: [],
            ratingHints: [],
            ratingOthers: [],
          };
          const itemSource = items.ratingSources[source.id];

          if (itemSource) {
            const itemPourings = itemSource['1'];
            const itemPushings = itemSource['2'];
            const itemHints = itemSource['8'];
            const itemOthers = itemSource['4'];

            ratings.ratingPourings = this.createRating(
              this.ratingPourings,
              itemPourings
            );
            ratings.ratingPushings = this.createRating(
              this.ratingPushings,
              itemPushings
            );
            ratings.ratingHints = this.createRating(
              this.ratingHints,
              itemHints
            );
            ratings.ratingOthers = this.createRating(
              this.ratingOthers,
              itemOthers
            );
          } else {
            ratings.ratingPourings = this.ratingPourings;
            ratings.ratingPushings = this.ratingPushings;
            ratings.ratingHints = this.ratingHints;
            ratings.ratingOthers = this.ratingOthers;
          }

          source[`ratings${items.id}${source.id}`] = [];
          source[`ratings${items.id}${source.id}`] = ratings;
        });
        //
        const resuts = [];
        this.latestRatings.forEach((e) => {
          const value = items.latestRatings[e.id];
          const temp = {
            name: e.name,
            value: value ? value : 0,
            color: e.color,
          };
          resuts.push(temp);
        });
        items['latestRatingsSource'] = [];
        items['latestRatingsSource'] = resuts;
      });
    }
    this.ref.markForCheck();
  }

  createRating(ratingSources: any[], ratingData: any) {
    const ratings = [];
    ratingSources.map((x) => {
      const filter = ratingData[x.id];
      if (filter) {
        const { value, tooltip } = this.sum(filter);
        ratings.push({
          name: x.name,
          value: value,
          color: x.color,
          tooltip: tooltip,
        });
      } else {
        ratings.push({ name: x.name, value: 0, color: x.color, tooltip: '' });
      }
    });
    return ratings;
  }

  sum = (arr: []) => {
    let sum = 0;
    const tooltip = [];
    arr.map((x) => {
      const name = this.dataProject.find((p) => p.id === x[0]);
      if (name) {
        tooltip.push(name.name + ': ' + x[1]);
      }
      sum = sum + x[1];
    });
    return { value: sum, tooltip: tooltip.join('\n') };
  };

  openDialogUser = () => {
    this.dialog
      .open({
        component: DialogUserComponent,
      })
      .subscribe((res) => {
        if (res && res.userId) {
          this.getReportDate(res.userId);
        }
      });
  };

  openDialogReportSearch() {
    this.dialog
      .open({
        component: DialogReportsSearchComponent,
        config: { width: '80vw', height: 'calc(100% - 2em)', autoFocus: false },
        data: {
          teamList: this.teamList,
          usersList: this.usersList,
          sourcesList: this.sourcesList,
          fromDate: this.fromDate,
          toDate: this.toDate,
          teamSelected: this.teamSelected,
          usersSelected: this.usersSelected,
          sourcesSelected: this.sourcesSelected,
        },
      })
      .subscribe((res) => {
        if (res && res.search) {
          this.filterData = { ...res.search };
          this.filterData.page = 1;
          this.routeRedirect();
        }
      });
  }
  getSelectedTeams(selected) {
    this.teamSelected = selected;
  }
  getSelectedusers(selected) {
    this.usersSelected = selected;
  }
  getSelectedSources(selected) {
    this.sourcesSelected = selected;
  }
}
