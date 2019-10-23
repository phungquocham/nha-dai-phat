import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ContactSourceService} from 'src/app/shared/services/api/contact-sources.service';
import {Utils} from 'src/app/shared/helpers/utilities';
import {DialogService} from '../../shared/services/others/dialog.service';
import {DialogConfirmComponent} from '../../shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import {CONFIRM} from '../../shared/helpers/const';
import {SnackbarService} from '../../shared/services/others/snackbar.service';
import {splitNames} from '../daily-reports/daily-reports.model';
import {SelectionModel} from '@angular/cdk/collections';
import {SNACKBAR} from '../../shared/helpers/snackbar';

@Component({
  selector: 'app-contact-sources-detail',
  templateUrl: './contact-sources-detail.component.html',
  styleUrls: ['./contact-sources-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ContactSourcesDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  ngUnsubscribe = new Subject();
  dataSource = [];
  isLoading = false;
  id = 0;
  name = '';
  from = '';
  to = '';
  // contactSources = [];
  colorValue = '';
  colorName = '';
  lastAssignedDate = false;
  selection = new SelectionModel<any>(true, []);

  constructor(
      private contactSourceService: ContactSourceService,
      private ref: ChangeDetectorRef,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private dialog: DialogService,
      private snackbar: SnackbarService,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id > 0) {
        this.id = params.id;
        this.getList();
      } else {
        this.id = 0;
      }
    });
  }

  ngAfterViewInit() {
    // this.getContactSources();
    this.getContactResult();
  }

  // getContactSources() {
  //   this.contactSources = [];
  //   this.contactSourceService.getListName().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
  //     if (response) {
  //       this.contactSources = response;
  //     }
  //   });
  // }
  getContactResult() {
    this.contactSourceService.getResultName().subscribe((response: any) => {
      if (response) {
        const result = response.find(color => color.id === 1);
        this.colorValue = result.color;
        this.colorName = result.name;
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getList() {
    this.selection.clear();
    this.dataSource = [];
    this.isLoading = true;
    this.ref.markForCheck();

    this.contactSourceService.getListId(this.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
      (response.assignments || []).forEach(element => {
        element.assignedDatePrototype = element.assignedDate;
        element.assignedDate = Utils.transform(element.assignedDate);
        element.assignedByUserNameTooltip = element.assignedByUserName;
        element.assignedByUserName = splitNames(element.assignedByUserName);
      });
      if (response.assignments.length === 0) {
        this.lastAssignedDate = true;
      } else if (response.assignments.length > 0) {
        const lastAssignedDate = response.assignments[0].assignedDate;
        const currentDate = Utils.transform(Utils.getTimestamp());
        if (lastAssignedDate === currentDate) {
          this.lastAssignedDate = false;
        } else {
          this.lastAssignedDate = true;
        }
      }
      this.name = response.name;
      this.from = response.fromContactId;
      this.to = response.toContactId;
      this.dataSource = response.assignments;
      this.isLoading = false;
      this.ref.markForCheck();
    });
  }

  onDelete(assignedDatePrototype) {
    this.dialog.open({
      component: DialogConfirmComponent,
      data: {message: 'Bạn có muốn xóa các liên hệ này không?'}
    }).subscribe(res => {
      if (res === CONFIRM.OK) {
        this.contactSourceService.deleteAssignments(this.id, assignedDatePrototype).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
          this.snackbar.open({message: 'Xóa thành công!', type: 'SUCCESS'});
          this.getList();
        });
      }
    });
  }

  onAssignedDate(assignedDate) {
    this.router.navigate([`/contact-sources/${this.id}/assignments/${assignedDate}`]);
  }

  onAdd() {
    this.router.navigate([`/contact-sources/${this.id}/assignments`]);
  }

  notProcessed(data) {
    const url = `/contacts?contactSourceIds=${this.id}&fromAssignedDate=${data.assignedDate}&toAssignedDate=${data.assignedDate}&contactResultIds=1`;
    this.router.navigateByUrl(url);
  }

  assignedCount(data) {
    const url = `/contacts?contactSourceIds=${this.id}&fromAssignedDate=${data.assignedDate}&toAssignedDate=${data.assignedDate}`;
    this.router.navigateByUrl(url);
  }

  onViewContact(data, assignedUserId) {
    const url = `/contacts?contactSourceIds=${this.id}&fromAssignedDate=${data.assignedDate}&toAssignedDate=${data.assignedDate}&assignedUserIds=${assignedUserId}`;
    this.router.navigateByUrl(url);
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

  confirmDelete() {
    this.dialog.open({
      component: DialogConfirmComponent,
      data: {
        message: 'Bạn chắc chắn muốn xóa nguồn khách hàng đã chọn?'
      }
    }).subscribe(ok => {
      if (ok === CONFIRM.OK) {
        const ids = this.selection.selected.map(i => i.assignedDatePrototype).join(',');
        this.contactSourceService.deleteContactResult(this.id, 1, ids).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
          this.snackbar.open({message: 'Xóa thành công', type: SNACKBAR.TYPE.SUCCESS});
          this.getList();
        });
      }
    });
  }

  splitNames(name) {
    return splitNames(name);
  }
}
