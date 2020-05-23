import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { RatingReportsService } from '../../shared/services/api/rating-reports.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Routing } from '../../shared/helpers/routing';
import { displayedColumns, filterData } from './rating-reports.model';
import { QueryEvents } from '../../shared/helpers/query-url';
import { Utils } from '../../shared/helpers/utilities';
import { UsersService } from '../../shared/services/api/users.service';
import { DailyReportService } from 'src/app/shared/services/api/daily-reports.service';
import { splitNames } from '../daily-reports/daily-reports.model';
import { TeamsService } from 'src/app/shared/services/api/teams.service';
import { first, takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { DialogService } from 'src/app/shared/services/others/dialog.service';
import { DialogRatingReportsSearchComponent } from './dialog-rating-reports-search/dialog-rating-reports-search.component';
import { CustomSelectAutocompleteComponent } from 'src/app/shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.component';

@Component({
  selector: 'app-rating-reports',
  templateUrl: './rating-reports.component.html',
  styleUrls: ['./rating-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class RatingReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  ngUnsubscribe = new Subject();
  columns = [];
  filterData = { ...filterData };
  dataSource = [];
  //
  fromDate = new Date();
  toDate = new Date();
  teamSelected = [];
  teamList = [];
  usersSelected = [];
  usersList = [];
  //
  RatingSources = [];
  teamTemplate = [];
  isLoading = false;
  @ViewChild('selectTeams') selectTeams: CustomSelectAutocompleteComponent;
  @ViewChild('selectUsers') selectUsers: CustomSelectAutocompleteComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private usersService: UsersService,
    private ratingReportsService: RatingReportsService,
    private dailyReportService: DailyReportService,
    private teamService: TeamsService,
    private dialog: DialogService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.reloadPage();
    return forkJoin(
      this.teamService.getTeamName().pipe(first()),
      this.usersService.getUserName().pipe(first()),
      this.dailyReportService.getRatingName().pipe(first())
    ).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      this.teamList = response[0];
      this.usersList = response[1];
      this.setGroup();
      this.setTeam();
      this.RatingSources = response[2].total;
      this.createColumns();
      this.renderData();
    });
  }

  setGroup() {
    if (this.teamList.length > 0) {
      this.selectTeams.setData(this.teamList);
      this.selectTeams.setSelectedDataBaseOnValue(this.teamSelected);
    }
  }

  setTeam() {
    if (this.usersList.length > 0) {
      this.selectUsers.setData(this.usersList);
      this.selectUsers.setSelectedDataBaseOnValue(this.usersSelected);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  reloadPage() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.initialFilter();
      this.setQueryString(params);
      this.filterData = QueryEvents.setQuery(this.filterData, params);
      this.getList();
    });
  }

  getList() {
    this.ref.markForCheck();
    this.isLoading = true;
    this.ratingReportsService.getList(this.filterData).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
      this.dataSource = response;
      this.isLoading = false;
      this.renderData();
    });
  }

  renderData() {
    if (this.dataSource.length > 0 && this.RatingSources.length > 0) {
      this.dataSource.forEach((element, i) => {
        element.id = i + 1;
        //
        element.reportUserNameTooltip = element.reportUserName;
        element.reportUserName = splitNames(element.reportUserName);
        //
        this.RatingSources.forEach(source => {
          const fil = element.ratings[source.id];
          let num = 0;
          const item = {
            color: '#27892f',
            value: '',
            tooltip: ''
          };
          if (fil) {
            num = Number(fil[1]) - Number(fil[0]);
            if (num > 0) {
              item.value = `+${num}`;
            } else if (num === 0) {
              item.value = `${num}`;
            } else {
              item.value = `${num}`;
              item.color = '#c02a1d';
            }
            item.tooltip = `${fil[0]} | ${fil[1]}`;
            // start sum
            const sumTeam = {
              teamId: element.teamId,
              ratingId: source.id,
              value: fil[0],
              value1: fil[1]
            };
            const filter = this.teamTemplate.find(t => t.teamId === element.teamId && t.ratingId === source.id);
            if (filter) {
              filter.value = filter.value + sumTeam.value;
              filter.value1 = filter.value1 + sumTeam.value1;
            } else {
              this.teamTemplate.push(sumTeam);
            }
            // end sum
          } else {
            item.color = '';
            item.value = 'N/A';
          }
          element[`value${element.id}${source.id}`] = item;
        });
      });
      if (this.teamSelected.length > 0) {
        this.groupTeam();
      }
      this.ref.markForCheck();
    }
  }

  groupTeam() {
    const groups = Utils.groupValues(this.dataSource, 'teamId');
    const newData = [];
    groups.forEach(group => {
      const firstItem = group[0];
      const filter = this.teamList.find(t => t.id === firstItem.teamId);
      if (filter) {
        const newItem = {
          reportUserName: filter.name,
          sum: true
        };
        this.RatingSources.forEach(rating => {
          const { value, color } = this.sumTotal(firstItem.teamId, rating.id);
          newItem['value' + rating.id] = value;
          newItem['color' + rating.id] = color;
        });
        newData.push(newItem);
        //
        group.forEach(element => {
          newData.push(element);
        });
      }
    });
    this.dataSource = [];
    this.dataSource = newData;
  }

  sumTotal(teamId: number, ratingId: number) {
    const total = this.teamTemplate.find(t => t.teamId === teamId && t.ratingId === ratingId);
    let color = '#27892f';
    let value = '';
    if (total) {
      const num = total.value1 - total.value;
      if (num > 0) {
        value = `+${num}`;
      } else if (num === 0) {
        value = `${num}`;
      } else {
        value = `${num}`;
        color = '#c02a1d';
      }
      return { value, color };
    }
    return { value, color };
  }

  initialFilter() {
    this.filterData = { ...filterData };
    this.dataSource = [];
    this.teamTemplate = [];
  }

  createColumns() {
    const tempColumn = [];
    this.RatingSources.forEach((element, index) => {
      const column = { column: 'column' + element.id, index: (5 + index) };
      const filter = tempColumn.find(c => c.column === column.column);
      if (!filter) {
        tempColumn.push(column);
      }
      element['column'] = 'column' + element.id;
    });
    this.columns = Utils.sortIndex(displayedColumns.concat(tempColumn)).map(item => item.column);
    this.ref.markForCheck();
  }

  setQueryString(params: Params) {
    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
    if (params.fromDate) {
      this.fromDate = Utils.convertDateTime(params.fromDate);
    } else {
      this.fromDate = new Date(y, m, date.getDate() - 2);
    }
    if (params.toDate) {
      this.toDate = Utils.convertDateTime(params.toDate);
    } else {
      this.toDate = new Date(y, m, date.getDate() - 1);
    }
    this.filterData.fromDate = Utils.convertDateString(this.fromDate);
    this.filterData.toDate = Utils.convertDateString(this.toDate);

    if (params.teamIds) {
      this.teamSelected = (params.teamIds || '').split(',').map(i => Number(i)).filter(i => i > 0);
    } else {
      this.teamSelected = [];
    }
    if (params.userIds) {
      this.usersSelected = (params.userIds || '').split(',').map(i => Number(i)).filter(i => i > 0);
    } else {
      this.usersSelected = [];
    }
    this.filterData.teamIds = this.teamSelected.map(i => Number(i)).filter(i => i).join(',');
    this.filterData.userIds = this.usersSelected.map(i => Number(i)).filter(i => i).join(',');
    this.setGroup();
    this.setTeam();
  }

  search() {
    this.filterData.fromDate = Utils.convertDateString(this.fromDate);
    this.filterData.toDate = Utils.convertDateString(this.toDate);
    this.filterData.teamIds = (this.teamSelected || []).map(i => Number(i)).filter(i => i).join(',');
    this.filterData.userIds = (this.usersSelected || []).map(i => Number(i)).filter(i => i).join(',');
    this.routeRedirect();
  }
  routeRedirect() {
    this.router.navigateByUrl(`${Routing.RATING_REPORTS}${Utils.encodeQueryData(this.filterData)}`);
  }
  openDialogReportSearch() {
    this.dialog.open({
      component: DialogRatingReportsSearchComponent,
      config: { width: '80vw', height: 'calc(100% - 2em)', autoFocus: false },
      data: {
        teamList: this.teamList,
        usersList: this.usersList,
        fromDate: this.fromDate,
        toDate: this.toDate,
        teamSelected: this.teamSelected,
        usersSelected: this.usersSelected,
      }
    }).subscribe(res => {
      if (res && res.search) {
        this.filterData = { ...res.search };
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
}
