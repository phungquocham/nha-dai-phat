import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PageEvent, MatPaginator } from '@angular/material';
import { FormControl } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';



import { Routing } from '../../shared/helpers/routing';
import { displayedColumns, filterData, ratings } from './contacts.model';
import { QueryEvents } from '../../shared/helpers/query-url';
import { Utils } from '../../shared/helpers/utilities';
import { PagingEvents } from '../../shared/helpers/pagingevent';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DialogService } from 'src/app/shared/services/others/dialog.service';
import { ContactsService } from 'src/app/shared/services/api/contacts.service';
import { ContactSourceService } from 'src/app/shared/services/api/contact-sources.service';
import { splitNames } from '../daily-reports/daily-reports.model';
import { DialogImportComponent } from './dialog/import/import.component';
import { DialogContactsFiltersComponent } from './dialog/dialog-contacts-filters/dialog-contacts-filters.component';
import { ContactsFiltersComponent } from './contacts-filters/contacts-filters.component';
import { UsersService } from 'src/app/shared/services/api/users.service';
import { ContactResultsService } from 'src/app/shared/services/api/contact-results.service';
import { DialogRecordForSalesComponent } from './dialog/dialog-record-for-sales/dialog-record-for-sales.component';
import { UserProfile } from 'src/app/shared/models/user.profile.namespace';
import { ROLE, BUTTON, CONFIRM } from 'src/app/shared/helpers/const';
import { TeamsService } from 'src/app/shared/services/api/teams.service';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogConfirmComponent } from 'src/app/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { SnackbarService } from 'src/app/shared/services/others/snackbar.service';
import { SNACKBAR } from 'src/app/shared/helpers/snackbar';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  providers: [ContactsService, ContactSourceService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ContactsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('bottomPaginator', { static: false }) bottomPaginator: MatPaginator;
  @ViewChild('contactsFiltersElement', { static: false }) contactsFiltersElement: ContactsFiltersComponent;

  private contactResultsList = [];
  private teamsList = [];
  private usersList = [];
  private contactSourcesList = [];
  ngUnsubscribe = new Subject();
  columns = [...displayedColumns].map(x => x.column);
  filterData = { ...filterData };
  isLoading = false;
  isLoadingResults = true;
  totalCount = 0;
  dataSource = [];
  fromDate = new Date();
  toDate = new Date();
  searchFormControl: FormControl = new FormControl();
  contactSources = [];
  contactSelected = 0;
  userRole = UserProfile.getRole();
  ROLE = ROLE;
  selection = new SelectionModel<any>(true, []);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private dialog: DialogService,
    private contactsService: ContactsService,
    private contactSourcesService: ContactSourceService,
    private usersService: UsersService,
    private contactResultsService: ContactResultsService,
    private teamsService: TeamsService,
    private snackbar: SnackbarService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    forkJoin(
      this.contactSourcesService.getListName(),
      this.usersService.getUserNamesList(),
      this.contactResultsService.getListContactResultNames(),
      this.teamsService.getTeamName()
    ).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any) => {
      this.contactSourcesList = res[0];
      this.usersList = res[1];
      this.contactResultsList = res[2];
      this.teamsList = res[3];
      this.contactsFiltersElement.setContactSourcesList(this.contactSourcesList);
      this.contactsFiltersElement.setUsersList(this.usersList);
      this.contactsFiltersElement.setContactResultsList(this.contactResultsList);
      this.contactsFiltersElement.setTeamsList(this.teamsList);
      this.reloadPage();
      this.getInit();
    });
  }

  reloadPage = () => {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.initialFilter();
      this.filterData = QueryEvents.setQuery(this.filterData, params);
      this.contactsFiltersElement.setSelectedContacts(this.filterData.contactSourceIds);
      this.contactsFiltersElement.setFromAssignedDate(this.filterData.fromAssignedDate);
      this.contactsFiltersElement.setToAssignedDate(this.filterData.toAssignedDate);
      this.contactsFiltersElement.setSelectedUsers(this.filterData.assignedUserIds);
      this.contactsFiltersElement.setContactResultIds(this.filterData.contactResultIds);
      this.contactsFiltersElement.setMinMatches(+this.filterData.minMatches);
      const event = new PageEvent();
      event.pageIndex = this.filterData.page - 1;
      event.pageSize = this.filterData.pageSize;
      this.setPaging(event, 'reload');
      this.getList();
    });
  }

  initialFilter() {
    this.filterData = { ...filterData };
  }

  copyMessage(val: string) {
    UserProfile.copyText({
      allow: true,
      value: val
    });
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  setPaging(event, router = null) {
    const item = new PagingEvents().init(event, router, this.filterData.pageSize);
    this.filterData.page = item.page;
    this.filterData.pageSize = item.pageSize;
    this.bottomPaginator.pageSize = item.pageSize;
    this.bottomPaginator.pageIndex = item.pageIndex;
  }

  private getFirstAndLastName(name: string) {
    const temp = name.split(' ');
    return `${temp[0]} ${temp[1]}`;
  }

  getList() {
    this.selection.clear();
    this.dataSource = [];
    this.isLoadingResults = true;
    this.isLoading = true;
    this.ref.markForCheck();
    this.contactsService.getList(this.filterData).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
      console.log(response);
      response.items.forEach(element => {
        const assignments = [];
        (element.assignments || []).forEach(el => {
          const { contactResultId, contactResultName, contactResultColor } = this.getContactResultInfo(el[3]);
          const item = {
            assignedDate: el[0],
            assignedUserId: el[1],
            assignedUserName: el[2],
            contactResultId,
            contactResult: contactResultName,
            contactResultColor,
            interestedProjectId: el[4],
            InterestedProjectName: el[5],
            appointmentDate: el[6],
            email: el[7],
            facebook: el[8],
            zalo: el[9],
            note: el[10],
            updatedAt: el[11],
            tooltip: ''
          };
          item.tooltip = this.createTooltipAssignments(item);
          item.assignedUserName = this.getFirstAndLastName(item.assignedUserName);
          assignments.push(item);
        });
        element.assignments = [];
        element.assignments = assignments;
      });
      this.dataSource = response.items;
      this.totalCount = response.totalCount;
      this.isLoadingResults = false;
      this.isLoading = false;
      this.ref.markForCheck();
    });
  }

  getContactResultInfo(id: number): any {
    const founded = this.contactResultsList.find(item => item.id === id);
    if (founded) {
      return {
        contactResultId: founded.id,
        contactResultName: founded.name,
        contactResultColor: founded.color
      };
    }
    return {
      contactResultId: -1,
      contactResultName: undefined,
      contactResultColor: ''
    };
  }

  createTooltipAssignments = (data: any) => {
    const item = [];
    if (data.assignedDate) {
      item.push(`Ngày giao : ${Utils.transform(data.assignedDate)}`);
    }
    item.push(`Tên : ${data.assignedUserName}`);
    if (data.contactResult) {
      item.push(`Kết quả : ${data.contactResult}`);
    }
    if (data.InterestedProjectName) {
      item.push(`Dự án : ${data.InterestedProjectName}`);
    }
    if (data.appointmentDate) {
      item.push(`Ngày hẹn : ${Utils.transform(data.appointmentDate)}`);
    }
    if (data.facebook || data.zalo) {
      const connec = [];
      if (data.facebook) {
        connec.push('Facebook');
      }
      if (data.zalo) {
        connec.push('Zalo');
      }
      item.push(`Kết nối : ${connec.join(', ')}`);
    }
    if (data.email) {
      item.push(`Email : ${data.email}`);
    }
    if (data.note) {
      item.push(`Ghi chú : ${data.note}`);
    }
    return item.join('\n');
  }

  onPagingEvent(event?: PageEvent) {
    this.setPaging(event);
    this.routeRedirect();
  }

  routeRedirect() {
    this.router.navigateByUrl(`${Routing.CONTACTS}${Utils.encodeQueryData(this.filterData)}`);
  }

  getInit = () => {
    return forkJoin(
    ).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {

    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onAddNew(id?: number) {
    if (id) {
      this.router.navigate([`${Routing.CONTACTS}/${id}`]);
    } else {
      this.dialog.open({
        component: DialogImportComponent
      }).subscribe(res => {
        if (res) {

        }
      });
    }
  }

  search = () => {

  }

  openDialogUser = () => {
    this.dialog.open({

    }).subscribe(res => {
      if (res && res.userId) {
      }
    });
  }

  openDialogContactsFilters() {
    this.dialog.open({
      component: DialogContactsFiltersComponent,
      data: {
        contactSourcesList: this.contactSourcesList,
        usersList: this.usersList,
        contactResultsList: this.contactResultsList,
        teamsList: this.teamsList
      },
      config: {
        autoFocus: false
      }
    }).subscribe(res => {
      if (res && res.status === BUTTON.OK) {
        this.router.navigate([Routing.CONTACTS], { queryParams: res.query });
      }
    });
  }

  openDialogRecordForSales(contactId: number, data: any) {
    this.dialog.open({
      component: DialogRecordForSalesComponent,
      data: {
        contactId,
        userInfo: data,
        contactResultsList: this.contactResultsList
      }
    }).subscribe(res => {
      if (res === BUTTON.OK) {
        this.getList();
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));
  }

  clearSelection() {
    this.selection.clear();
  }

  confirmDelete() {
    this.dialog.open({
      component: DialogConfirmComponent,
      data: {
        message: 'Bạn chắc chắn muốn xóa khách hàng đã chọn?'
      }
    }).subscribe(ok => {
      if (ok === CONFIRM.OK) {
        const ids = this.selection.selected.map(i => i.id);
        this.contactsService
          .deleteMultipleContacts(ids)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(_ => {
            this.snackbar.open({ message: 'Xóa thành công', type: SNACKBAR.TYPE.SUCCESS });
            this.getList();
          });
      }
    });
  }

  exportTable() {
    this.contactsService.export(this.filterData as any).pipe(takeUntil(this.ngUnsubscribe)).subscribe(_ => {
      this.snackbar.open({ message: 'Đã gửi yêu cầu thành công', type: SNACKBAR.TYPE.SUCCESS });
    });
  }

}
