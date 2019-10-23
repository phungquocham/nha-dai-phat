import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { SourcesService } from 'src/app/shared/services/api/sources.service';
import { ProjectsService } from 'src/app/shared/services/api/projects.service';
import { TeamsService } from 'src/app/shared/services/api/teams.service';
import { UsersService } from 'src/app/shared/services/api/users.service';
import { REGEX } from 'src/app/shared/helpers/regex';
import { ModelUserInList } from 'src/app/shared/models/users.model';
import { DialogService } from 'src/app/shared/services/others/dialog.service';
import { DialogConfirmComponent } from 'src/app/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { CONFIRM, TYPE_BASIC, TYPE_COMPONENT, USER_STATUSES } from 'src/app/shared/helpers/const';
import { DialogEditUserComponent } from './dialogs/dialog-edit-user/dialog-edit-user.component';
import { Utils } from 'src/app/shared/helpers/utilities';
import { DialogUpdateNameComponent } from 'src/app/shared/components/dialogs/dialog-update-name/dialog-update-name.component';
import { DialogUpdateRatingComponent } from '../ratings/dialogs/dialog-update-rating/dialog-update-rating.component';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Routing } from 'src/app/shared/helpers/routing';
import { ModelQueryUrl } from 'src/app/shared/models/url-query.model';
import { ReportsService } from 'src/app/shared/services/api/reports.service';
import { RatingsService } from 'src/app/shared/services/api/ratings.service';
import { UserProfile } from 'src/app/shared/models/user.profile.namespace';
import { SnackbarService } from 'src/app/shared/services/others/snackbar.service';
import { SNACKBAR } from 'src/app/shared/helpers/snackbar';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ManagerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('paginator', {static: false}) paginator: MatPaginator;

  private modelUserInList = new ModelUserInList();
  private ngUnsubscribe = new Subject();

  TYPE_COMPONENT = TYPE_COMPONENT;
  USER_STATUSES = USER_STATUSES;
  tabIndex = 0;

  private ratingsList = [];
  ratingsListFilter = [];
  displayedColumnsRating = ['name', 'points'];

  private sourcesList: ModelBasic[] = [];
  sourcesListFilter: ModelBasic[] = [];
  sourceConfirmMessage = 'Bạn chắc chắn muốn xóa nguồn này?';
  displayedColumnsSource = ['name'];

  private projectsList: ModelBasic[] = [];
  projectsListFilter: ModelBasic[] = [];
  projectConfirmMessage = 'Bạn chắc chắn muốn xóa dự án này?';
  displayedColumnsProject = ['name'];

  private teamsList: ModelBasic[] = [];
  teamsListFilter: ModelBasic[] = [];
  teamConfirmMessage = 'Bạn chắc chắn muốn xóa nhóm này?';
  displayedColumnsTeam = ['name'];

  usersList = [];
  userConfirmMessage = 'Bạn chắc chắn muốn xóa nhân viên này?';
  displayedColumnsUser = this.modelUserInList.getKeys({ exceptKeys: ['teamId'] });
  usersTotalCount = 0;
  pageSize = 25;
  searchUserString = '';
  userProfileId = UserProfile.getUserId();
  private searchChange = new Subject<string>();
  private query = new ModelQueryUrl();

  constructor(
    private cdr: ChangeDetectorRef,
    private sourcesService: SourcesService,
    private projectsService: ProjectsService,
    private teamsService: TeamsService,
    private usersService: UsersService,
    private ratingsService: RatingsService,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: SnackbarService
  ) {
  }

  ngOnInit() {
    this.setupUsersQueryParams();
    this.setupUsersSearch();
  }

  ngAfterViewInit() {
    this.getSourcesList();
    this.getProjectsList();
    this.getTeamsList();
    this.getRatingsList();
  }

  ngOnDestroy() {

  }

  private detectChanges() {
    this.cdr.detectChanges();
  }

  lockUser(id: number) {
    this.usersService.lockUser(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(_ => {
      this.getUsersList();
    });
  }

  unlockUser(id: number) {
    this.usersService.unlockUser(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(_ => {
      this.getUsersList();
    });
  }

  private setupUsersQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      console.log(queryParams);
      // check tab index - begin
      Object.keys(this.query).forEach(key => {
        if (queryParams[key]) {
          this.query[key] = queryParams[key];
        }
      });
      const tabName = queryParams['display'] || '';
      switch (tabName) {
        case 'sources':
          this.tabIndex = 1;
          break;
        case 'projects':
          this.tabIndex = 2;
          break;
        case 'teams':
          this.tabIndex = 3;
          break;
        case 'users':
          this.tabIndex = 4;
          break;
        default:
          this.tabIndex = 0;
      }
      if (this.query.q) {
        this.searchUserString = this.query.q;
      } else {
        this.searchUserString = '';
      }
      if (this.query.page > 1) {
        this.paginator.pageIndex = this.query.page - 1;
      } else {
        this.paginator.pageIndex = 0;
      }
      // check tab index - end
      this.getUsersList(this.getQueryUrlForApi(this.query));
    });
  }

  private getRatingsList() {
    this.ratingsService.getRatingsList().pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.ratingsList = res;
      this.ratingsListFilter = this.ratingsList;
      this.detectChanges();
    });
  }

  private getUsersList(query?: string) {
    if (!query) {
      this.query.page = this.paginator.pageIndex + 1;
      this.query.pageSize = this.pageSize;
      query = this.getQueryUrlForApi(this.query);
    }
    this.usersService.getList(query).subscribe((res: IResponseUsers) => {
      res.items.forEach((item: ModelUserInList) => {
        item.phone = Utils.ConvertPhoneNumberToZero(item.phone);
      });
      this.usersList = res.items;
      this.usersTotalCount = res.totalCount;
      this.query.page = 1;
      this.detectChanges();
    });
  }

  private getTeamsList() {
    this.teamsService.getList().subscribe(res => {
      this.teamsList = res;
      this.teamsListFilter = this.teamsList;
      this.detectChanges();
    });
  }

  private getSourcesList() {
    this.sourcesService.getList().subscribe(res => {
      this.sourcesList = res;
      this.sourcesListFilter = this.sourcesList;
      this.detectChanges();
    });
  }

  private getProjectsList() {
    this.projectsService.getList().subscribe(res => {
      this.projectsList = res;
      this.projectsListFilter = this.projectsList;
      this.detectChanges();
    });
  }

  addSource() {
    this.dialog.open({
      component: DialogUpdateRatingComponent,
      data: {
        type: TYPE_BASIC.NEW
      }
    }).subscribe(res => {
      if (res && res.status === CONFIRM.OK) {
        this.sourcesService.createSource(res.data).subscribe(_ => {
          this.getSourcesList();
        });
      }
    });
  }

  updateSource(status: string, data: any) {
    if (status === CONFIRM.OK) {
      this.dialog.open({
        component: DialogUpdateRatingComponent,
        data: data
      }).subscribe(res => {
        if (res && res.status === CONFIRM.OK) {
          this.sourcesService.updateSource(data.id, res.data).subscribe(_ => {
            this.getSourcesList();
          });
        }
      });
    }
  }

  confirmDeleteSource(id: number) {
    this.sourcesService.deleteSource(id).subscribe(_ => {
      this.getSourcesList();
    });
  }

  addProject() {
    this.dialog.open({
      component: DialogUpdateNameComponent,
      data: {
        type: TYPE_BASIC.NEW
      }
    }).subscribe(res => {
      if (res && res.status === CONFIRM.OK) {
        this.projectsService.createProject(res.data).subscribe(_ => {
          this.getProjectsList();
        });
      }
    });
  }

  updateProject(data) {
    if (data && data.value && data.value.status === CONFIRM.OK) {
      this.projectsService.updateProject(data.id, data.value.data).subscribe(_ => {
        this.getProjectsList();
      });
    }
  }

  confirmDeleteProject(id: number) {
    this.projectsService.deleteProject(id).subscribe(_ => {
      this.getProjectsList();
    });
  }

  addTeam() {
    this.dialog.open({
      component: DialogUpdateNameComponent,
      data: {
        type: TYPE_BASIC.NEW
      }
    }).subscribe(res => {
      if (res && res.status === CONFIRM.OK) {
        this.teamsService.createTeam(res.data).subscribe(_ => {
          this.getTeamsList();
        });
      }
    });
  }

  updateTeam(data) {
    if (data && data.value && data.value.status === CONFIRM.OK) {
      this.teamsService.updateTeam(data.id, data.value.data).subscribe(_ => {
        this.getTeamsList();
      });
    }
  }

  confirmDeleteTeam(id: number) {
    this.teamsService.deleteTeam(id).subscribe(_ => {
      this.getTeamsList();
    });
  }

  addUser() {
    this.dialog.open({
      component: DialogEditUserComponent,
      data: {
        type: 'NEW'
      }
    }).subscribe(res => {
      if (res) {
        this.usersService.createUser(res).subscribe(_ => {
          this.snackbar.open({ message: 'Thêm thành công', type: SNACKBAR.TYPE.SUCCESS });
          this.getUsersList();
        });
      }
    });
  }

  confirmDeleteUser(id: number) {
    this.dialog.open({
      component: DialogConfirmComponent,
      data: {
        message: 'Bạn chắc chắn muốn xóa người dùng này?'
      }
    }).subscribe(ok => {
      if (ok === CONFIRM.OK) {
        this.usersService.deleteUser(id).subscribe(_ => {
          this.snackbar.open({ message: 'Xoá thành công', type: SNACKBAR.TYPE.SUCCESS });
          this.getUsersList();
        });
      }
    });
  }

  editUser(data: any) {
    this.dialog.open({
      component: DialogEditUserComponent,
      data: data
    }).subscribe(res => {
      if (res && res.id) {
        this.usersService.updateUser(res.id, res.data).subscribe(_ => {
          this.snackbar.open({ message: 'Cập nhật thành công', type: SNACKBAR.TYPE.SUCCESS });
          this.getUsersList();
        });
      }
    });
  }

  applyRatingsFilter(value: string) {
    this.ratingsListFilter = this.ratingsList.filter(item => item.name.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase()));
  }

  applySourceFilter(value: string) {
    this.sourcesListFilter = this.sourcesList.filter(item => item.name.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase()));
  }

  applyProjectFilter(value: string) {
    this.projectsListFilter = this.projectsList.filter(item => item.name.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase()));
  }

  applyTeamFilter(value: string) {
    this.teamsListFilter = this.teamsList.filter(item => item.name.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase()));
  }

  openDialogUpdateRating(data: any) {
    this.dialog.open({
      component: DialogUpdateRatingComponent,
      data: data
    }).subscribe(res => {
      if (res && res.status === CONFIRM.OK) {
        this.ratingsService.updateRating(data.id, res.data).subscribe(_ => {
          this.snackbar.open({ message: 'Cập nhật thành công!', type: SNACKBAR.TYPE.SUCCESS });
          this.getRatingsList();
        });
      }
    });
  }

  changeTab(index: number) {
    console.log(index);
    switch (index) {
      case 0:
        this.routeToTab('');
        break;
      case 1:
        this.routeToTab('sources');
        break;
      case 2:
        this.routeToTab('projects');
        break;
      case 3:
        this.routeToTab('teams');
        break;
      case 4:
        this.routeToTab('users');
        break;
    }
  }

  private routeToTab(name: string) {
    if (!name) {
      this.router.navigate([Routing.MANAGER]);
      return;
    }
    this.router.navigate([Routing.MANAGER], { queryParams: { 'display': name } });
    // [`${Utils.getProjectRouter(`${Routing.SETTING_USERS}`)}`],
    // { queryParams: { [this.TAB.KEY.DISPLAY]: this.TAB.NAME.PERMISSION_LEVELS } }
  }

  private setupUsersSearch() {
    this.searchChange.pipe(debounceTime(500), takeUntil(this.ngUnsubscribe)).subscribe(value => {
      value = value.trim().toLowerCase();
      if (this.query.q.localeCompare(value) !== 0) {
        this.query.q = value;
        this.query.page = 1;
        this.getUsersListRouter(this.query);
      }
    });
  }

  private getQueryUrlForApi(query: ModelQueryUrl): string {
    return Utils.encodeQueryUrl({
      query: query
    });
  }

  private getQueryUrlForRouter(query: ModelQueryUrl): any {
    const obj = {};
    obj['display'] = 'users';
    const result = Utils.encodeQueryUrl({
      query: query,
      exceptKeys: ['pageSize'],
      exceptStrings: ['page=1']
    }, true);
    Object.keys(result).forEach(key => {
      obj[key] = result[key];
    });
    return obj;
  }


  private getUsersListRouter(query: ModelQueryUrl) {
    console.log(this.getQueryUrlForRouter(query));
    this.router.navigate([Routing.MANAGER], { queryParams: this.getQueryUrlForRouter(query) });
  }

  searchUsers(name: string) {
    this.searchChange.next(name);
  }

  onPagingEvent(page: PageEvent) {
    this.query.page = page.pageIndex + 1;
    this.query.pageSize = page.pageSize;
    console.log(this.query);
    this.getUsersListRouter(this.query);
  }

}

interface ModelBasic {
  id: number;
  name: string;
  color?: string;
}

interface IResponseUsers {
  items: ModelUserInList[];
  totalCount: number;
  extraData?: any;
}
