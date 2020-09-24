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
import { TelesalesReportService } from '../../shared/services/api/telesales-reports.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Routing } from '../../shared/helpers/routing';
import { displayedColumns, filterData } from './telesales-reports.model';
import { QueryEvents } from '../../shared/helpers/query-url';
import { Utils } from '../../shared/helpers/utilities';
import { SnackbarService } from '../../shared/services/others/snackbar.service';
import { forkJoin, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/app/shared/services/others/dialog.service';
import { setDate, splitNames } from '../daily-reports/daily-reports.model';
import { DialogTelesalesReportsComponent } from './dialog-telesales-reports/dialog-telesales-reports.component';
import { ExportTelesalesReportService } from 'src/app/shared/services/api/export-telesales-report.service';

@Component({
  selector: 'app-telesales-reports',
  templateUrl: './telesales-reports.component.html',
  styleUrls: ['./telesales-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TelesalesReportsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  ngUnsubscribe = new Subject();
  columns = Utils.sortIndex(displayedColumns).map((item) => item.column);
  filterData = { ...filterData };
  dataSource = [];
  permission = '';
  templateSources = [];
  //
  ratingPourings = [];
  ratingPushings = [];
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

  constructor(
    private dailyReportService: DailyReportService,
    private telesalesReportService: TelesalesReportService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private snackbar: SnackbarService,
    private dialog: DialogService,
    private exportTelesalesExcelService: ExportTelesalesReportService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.reloadPage();
    this.getInit();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getInit() {
    return forkJoin(this.dailyReportService.getRatingName().pipe(first()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        this.ratingPourings = response[0].pourings;
        this.ratingPushings = response[0].pushings;
        this.ratingOthers = response[0].others;
        this.renderRatingSources();
      });
  }

  setQueryString(params: Params) {
    const { fromDate, fromDateString, toDate, toDateString } = setDate(params);
    this.fromDate = fromDate;
    this.filterData.fromDate = fromDateString;
    this.toDate = toDate;
    this.filterData.toDate = toDateString;
  }

  initialFilter() {
    this.filterData = { ...filterData };
  }

  reloadPage() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.initialFilter();
      this.setQueryString(params);
      this.filterData = QueryEvents.setQuery(this.filterData, params);
      this.getList();
    });
  }

  routeRedirect() {
    this.router.navigateByUrl(
      `${Routing.TELESALES_REPORTS}${Utils.encodeQueryData(this.filterData)}`
    );
  }

  getList() {
    this.dataSource = [];
    this.isLoading = true;
    this.ref.markForCheck();
    this.telesalesReportService
      .getList(this.filterData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        response.forEach((element) => {
          element.teleUserNameTooltip = element.teleUserName;
          element.teleUserName = splitNames(element.teleUserName);
        });
        this.dataSource = response;
        this.isLoading = false;
        this.renderRatingSources();
      });
  }

  search() {
    this.filterData.fromDate = Utils.convertDateString(this.fromDate);
    this.filterData.toDate = Utils.convertDateString(this.toDate);
    this.routeRedirect();
  }

  renderRatingSources() {
    if (this.dataSource.length > 0 && this.ratingPourings.length > 0) {
      this.dataSource.map((items) => {
        const ratings = {
          ratingPourings: [],
          ratingPushings: [],
          ratingOthers: [],
        };

        ratings.ratingPourings = this.createRating(
          this.ratingPourings,
          items.ratingItems['1']
        );
        ratings.ratingPushings = this.createRating(
          this.ratingPushings,
          items.ratingItems['2']
        );
        ratings.ratingOthers = this.createRating(
          this.ratingOthers,
          items.ratingItems['4']
        );

        items[`ratings`] = [];
        items[`ratings`] = ratings;
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
          value,
          color: x.color,
          tooltip,
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
    arr = Utils.sortDESC(arr);
    arr.map((x) => {
      if (x[2]) {
        tooltip.push(
          `[ ${Utils.transform(x[0])} ] ${x[1]} - ${x[2]} - ${x[3]}`
        );
      } else {
        tooltip.push(`[ ${Utils.transform(x[0])} ] ${x[1]} - ${x[3]}`);
      }
      sum = sum + x[3];
    });
    return { value: sum, tooltip: tooltip.join('\n') };
  };

  openDialogReportSearch() {
    this.dialog
      .open({
        component: DialogTelesalesReportsComponent,
        config: { width: '80vw', height: 'calc(100% - 2em)', autoFocus: false },
        data: {
          fromDate: this.fromDate,
          toDate: this.toDate,
        },
      })
      .subscribe((res) => {
        if (res && res.search) {
          this.filterData = { ...res.search };
          this.routeRedirect();
        }
      });
  }

  exportReport() {
    this.exportTelesalesExcelService.exportExcel({
      title: `Telesales Report -- ${Utils.convertDateString(
        this.fromDate
      )} - ${Utils.convertDateString(this.toDate)}`,
      data: this.dataSource,
    });
  }
}
