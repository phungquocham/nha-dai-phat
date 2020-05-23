import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Routing } from '../../shared/helpers/routing';
import { QueryEvents } from '../../shared/helpers/query-url';
import { Utils } from '../../shared/helpers/utilities';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PagingEvents } from '../../shared/helpers/pagingevent';
import { forkJoin, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ContactSourceService } from 'src/app/shared/services/api/contact-sources.service';
import { FormControl } from '@angular/forms';
import { displayedColumns, filterData } from './contact-sources.model';
import { DialogImportComponent } from '../contacts/dialog/import/import.component';
import { DialogService } from '../../shared/services/others/dialog.service';
import { ContactSourceEditComponent } from './dialog/edit/contact-sources-edit.component';
import { DialogConfirmComponent } from '../../shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { CONFIRM } from '../../shared/helpers/const';
import { SnackbarService } from '../../shared/services/others/snackbar.service';

@Component({
  selector: 'app-contact-sources',
  templateUrl: './contact-sources.component.html',
  styleUrls: ['./contact-sources.component.scss'],
  providers: [ContactSourceService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ContactSourcesComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('bottomPaginator') bottomPaginator: MatPaginator;
  ngUnsubscribe = new Subject();
  columns = [...displayedColumns].map((x) => x.column);
  filterData = { ...filterData };
  isLoading = false;
  isLoadingResults = true;
  totalCount = 0;
  dataSource = [];
  fromDate = new Date();
  toDate = new Date();
  searchFormControl: FormControl = new FormControl();
  searchChange = new Subject<string>();
  contactSources = [];
  contactSelected = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private contactSourceService: ContactSourceService,
    private dialog: DialogService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.reloadPage();
    this.getInit();
    this.searchFormControl.valueChanges.subscribe((val) => {
      this.searchChange.next(val);
    });
    this.applyFilter();
  }

  reloadPage = () => {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.initialFilter();
      this.setQueryString(params);
      this.filterData = QueryEvents.setQuery(this.filterData, params);
      const event = new PageEvent();
      event.pageIndex = this.filterData.page - 1;
      event.pageSize = this.filterData.pageSize;
      this.setPaging(event, 'reload');
      this.getList();
    });
  };

  setValueFormControl(value) {
    this.searchFormControl.setValue(value, {
      emitEvent: false,
      onlySelf: true,
    });
    if (!value) {
      this.searchChange.next(null);
    }
  }

  applyFilter() {
    this.searchChange
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((key) => {
        if (key !== null) {
          this.initialFilter();
          this.filterData.q = key || '';
          this.routeRedirect();
        }
      });
  }

  initialFilter() {
    this.filterData = { ...filterData };
  }

  setQueryString = (params: Params) => {
    params.q
      ? this.setValueFormControl(params.q)
      : this.setValueFormControl(null);
  };

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

  getList() {
    this.dataSource = [];
    this.isLoadingResults = true;
    this.isLoading = true;
    this.ref.markForCheck();
    this.contactSourceService
      .getList(this.filterData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        response.items.forEach((element) => {
          element.lastAssignedDate = element.lastAssignedDate
            ? Utils.transform(element.lastAssignedDate)
            : '';
        });
        this.dataSource = response.items;
        this.totalCount = response.totalCount;
        this.isLoadingResults = false;
        this.isLoading = false;
        this.ref.markForCheck();
      });
  }

  onPagingEvent(event?: PageEvent) {
    this.setPaging(event);
    this.routeRedirect();
  }

  routeRedirect() {
    this.router.navigateByUrl(
      `${Routing.CONTACT_SOURCES}${Utils.encodeQueryData(this.filterData)}`
    );
  }

  getInit = () => {
    return forkJoin()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {});
  };

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onViewDetail(id) {
    this.router.navigate([`/contact-sources/${id}`]);
  }

  onEdit(data) {
    this.dialog
      .open({
        component: ContactSourceEditComponent,
        data: data,
      })
      .subscribe((res) => {
        console.log(res);
        if (res && res.edit) {
          this.getList();
        }
      });
  }

  onDelete(id) {
    this.dialog
      .open({
        component: DialogConfirmComponent,
        data: { message: 'Bạn có muốn xóa nguồn này không?' },
      })
      .subscribe((res) => {
        if (res === CONFIRM.OK) {
          this.contactSourceService
            .delete(id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
              (response) => {
                this.snackbar.open({
                  message: 'Xóa thành công!',
                  type: 'SUCCESS',
                });
                this.getList();
              },
              (err) => {
                if (err.status === 404) {
                  this.snackbar.open({
                    message: 'Không xóa được.',
                    type: 'ERROR',
                  });
                }
              },
              () => console.log('HTTP request completed.')
            );
        }
      });
  }

  onAddNew() {
    this.dialog
      .open({
        component: DialogImportComponent,
      })
      .subscribe((res) => {
        if (res) {
        }
      });
  }
}
