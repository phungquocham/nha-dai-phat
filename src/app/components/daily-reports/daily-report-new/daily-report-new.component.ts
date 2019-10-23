import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, QueryList, ViewChildren, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DailyReportModel } from '../daily-reports.model';
import { DailyReportService } from '../../../shared/services/api/daily-reports.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Utils } from '../../../shared/helpers/utilities';
import { v4 as uuid } from 'uuid';
import { forkJoin, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { Routing } from '../../../shared/helpers/routing';
import { SnackbarService } from '../../../shared/services/others/snackbar.service';
import { numericNumberReg } from '../../../shared/helpers/regex';
import { DailyReportSourceComponent } from './daily-report-source/daily-report-source.component';
import { DailyReportFieldsComponent } from './daily-report-fields/daily-report-fields.component';
import { DialogService } from '../../../shared/services/others/dialog.service';
import { DialogUserComponent } from '../dialogs/dialog-user/dialog-user.component';
import { UserProfile } from 'src/app/shared/models/user.profile.namespace';
import { UsersService } from 'src/app/shared/services/api/users.service';

@Component({
  selector: 'app-daily-report-new',
  templateUrl: './daily-report-new.component.html',
  styleUrls: ['./daily-report-new.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyReportNewComponent implements OnInit, OnDestroy {
  @ViewChildren('dailyReportSourceComponent') dailyReportSourceComponent: QueryList<DailyReportSourceComponent>;
  @ViewChildren('dailyReportFieldsComponent') dailyReportFieldsComponent: QueryList<DailyReportFieldsComponent>;
  form: FormGroup;
  isNewType = true;
  dailyReportModel = new DailyReportModel();
  templateSources = [];
  ratingTotalSources = [];
  ratingTotalData = {};
  latestRatings = undefined;
  //
  ratingPourings = [];
  ratingPushings = [];
  ratingOthers = [];
  dataProjects = [];
  reportDate = '';
  reportId: any;
  // role admin
  reportUserId = 0;
  reportUserName = '';
  usersList = [];
  ngUnsubscribe = new Subject();

  constructor(
    private fb: FormBuilder,
    private dailyReportService: DailyReportService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private snackbar: SnackbarService,
    private activatedRoute: ActivatedRoute,
    private dialog: DialogService,
    private usersService: UsersService,
  ) {
    const requiredPattern = [Validators.required, Validators.min(0), Validators.pattern(numericNumberReg)];
    const noRequiredPattern = [Validators.required, Validators.min(0), Validators.pattern(numericNumberReg)];
    this.form = this.fb.group({
      goldenHours: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(8),
      Validators.pattern(numericNumberReg)])],
      uncontactable: [0, Validators.compose(requiredPattern)],
      notPickUp: [0, Validators.compose(requiredPattern)],
      noNeed: [0, Validators.compose(requiredPattern)],
      hangUp: [0, Validators.compose(requiredPattern)],
      twoSentences: [0, Validators.compose(requiredPattern)],
      moreThanTwoSentences: [0, Validators.compose(requiredPattern)],
      self_uncontactable: [0, Validators.compose(requiredPattern)],
      self_notPickUp: [0, Validators.compose(requiredPattern)],
      self_noNeed: [0, Validators.compose(requiredPattern)],
      self_hangUp: [0, Validators.compose(requiredPattern)],
      self_twoSentences: [0, Validators.compose(requiredPattern)],
      self_moreThanTwoSentences: [0, Validators.compose(requiredPattern)],
      pushCount: [0, Validators.compose(noRequiredPattern)],
      suggestionCount: [0, Validators.compose(noRequiredPattern)],
      emailCount: [0, Validators.compose(noRequiredPattern)],
      zaloFlirtingCount: [0, Validators.compose(noRequiredPattern)],
      facebookFlirtingCount: [0, Validators.compose(noRequiredPattern)]
    });
    this.activatedRoute.queryParams.subscribe((query: Params) => {
      this.reportUserId = query.reportUserId ? Number(query.reportUserId) : 0;
      this.activatedRoute.params.subscribe((params: Params) => {
        if (params.id > 0) {
          this.isNewType = false;
          this.reportId = params.id;
        } else {
          this.isNewType = true;
          this.getReportDate();
        }
        this.dailyReportModel.ratingSources = [];
      });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.getProjects();
    this.getUsers();
    this.getInit();
  }

  getInit() {
    return forkJoin(
      this.dailyReportService.getRatingName().pipe(first()),
      this.dailyReportService.getSourceName().pipe(first())
    ).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      this.ratingPourings = response[0].pourings;
      this.ratingPushings = response[0].pushings;
      this.ratingOthers = response[0].others;
      this.ratingTotalSources = response[0].total;
      this.templateSources = response[1];
      this.setLatestRatings();
      this.renderTemplate();
      this.ref.markForCheck();
    });
  }

  renderTemplate() {
    if (this.reportId > 0) {
      this.getId(this.reportId);
    } else {
      this.templateSources.forEach(source => {
        source.ratingSources = [
          { id: 1, name: 'Đổ', subTab: [{ uid: uuid() }] },
          { id: 2, name: 'Đẩy', subTab: [{ uid: uuid() }] },
          { id: 4, name: 'Khác', subTab: [{ uid: uuid() }] }
        ];
        source.expanded = false;
        source.selectedIndex = 0;
      });
    }
  }

  getProjects() {
    this.dailyReportService.getProjectName().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      this.dataProjects = response;
      this.ref.markForCheck();
    });
  }

  getUsers() {
    this.usersService.getUserName(1).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.usersList = res;
      this.ref.markForCheck();
    });
  }

  getId(id: any) {
    this.dailyReportService.getId(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      this.form.controls.goldenHours.setValue(response.goldenHours);
      this.form.controls.pushCount.setValue(response.pushCount);
      this.form.controls.suggestionCount.setValue(response.suggestionCount);
      this.form.controls.emailCount.setValue(response.emailCount);
      this.form.controls.zaloFlirtingCount.setValue(response.zaloFlirtingCount);
      this.form.controls.facebookFlirtingCount.setValue(response.facebookFlirtingCount);
      //
      this.reportDate = Utils.transform(response.reportDate);
      this.reportUserName = response.reportUserName;
      //
      this.setEditRatingFields(response.latestRatings);
      Object.keys(response.regularPouring).forEach(key => {
        this.form.controls[key].setValue(response.regularPouring[key]);
      });
      Object.keys(response.selfPouring).forEach(key => {
        this.form.controls[`self_${key}`].setValue(response.selfPouring[key]);
      });
      this.templateSources.forEach(source => {
        const filter = response.ratingSources.find(item => item.sourceId === source.id);
        if (filter) {
          const pourings = filter.ratingItems.filter(p => p.type === 1);
          const pushings = filter.ratingItems.filter(p => p.type === 2);
          const others = filter.ratingItems.filter(p => p.type === 4);
          source.ratingSources = [
            { id: 1, name: 'Đổ', subTab: this.createComponent(pourings, filter.sourceId, 1) },
            { id: 2, name: 'Đẩy', subTab: this.createComponent(pushings, filter.sourceId, 2) },
            { id: 4, name: 'Khác', subTab: this.createComponent(others, filter.sourceId, 4) }
          ];
        } else {
          source.ratingSources = [
            { id: 1, name: 'Đổ', subTab: [{ uid: uuid() }] },
            { id: 2, name: 'Đẩy', subTab: [{ uid: uuid() }] },
            { id: 4, name: 'Khác', subTab: [{ uid: uuid() }] }
          ];
        }
        source.expanded = false;
        source.selectedIndex = 0;
      });
    });
  }

  setEditRatingFields(ratings: {}) {
    if (ratings) {
      Object.keys(ratings).forEach(r => {
        const fil = this.ratingTotalSources.find(s => s.id === Number(r));
        if (fil) {
          fil['value'] = ratings[r];
        }
      });
      this.ref.markForCheck();
    }
  }

  onEventChangeFields(e: any) {
    if (e) {
      this.ratingTotalData[e.id] = e.value;
    }
  }

  createComponent(component: any, sourceId, tabId) {
    const tab = [];
    if (!component || component.length === 0) {
      tab.push({ uid: uuid() });
    } else {
      component.forEach(item => {
        item.sourceId = sourceId;
        item.tabId = tabId;
        tab.push({ uid: uuid(), setValue: item });
      });
    }
    return tab;
  }

  onEventSource(event: any, sourceId: any, tabId: any, index: number, uid: any) {
    if (event.add) {
      const filter = this.templateSources.find(item => item.id === sourceId).ratingSources.find(item => item.id === tabId);
      if (filter.subTab.length - 1 === index) {
        filter.subTab.push({ uid: uuid() });
      }
    } else if (event.delete) {
      const filter = this.templateSources.find(item => item.id === sourceId).ratingSources.find(item => item.id === tabId);
      if (filter.subTab.length > 1) {
        filter.subTab = filter.subTab.filter(x => x.uid !== event.uid);
        const data = this.dailyReportModel.ratingSources.find(item => item.sourceId === sourceId);
        if (data) {
          data.ratingItems = data.ratingItems.filter(item => item.uid !== uid);
        }
      } else if (filter.subTab.length - 1 === index) {
        const data = this.dailyReportModel.ratingSources.find(item => item.sourceId === sourceId);
        if (data) {
          data.ratingItems = [];
        }
        filter.subTab = [];
        filter.subTab.push({ uid: uuid() });
      }
    } else {
      const data = this.dailyReportModel.ratingSources.find(item => item.sourceId === sourceId);
      if (!data) {
        const source = new DailyReportModel().ratingSources[0];
        source.sourceId = sourceId;
        event.type = tabId;
        source.ratingItems.push(event);
        this.dailyReportModel.ratingSources.push(source);
      } else {
        const items = data.ratingItems.find(item => item.uid === uid);
        event.type = tabId;
        if (items) {
          Object.keys(event).forEach(key => {
            items[key] = event[key];
          });
        } else {
          data.ratingItems.push(event);
        }
      }
    }
  }

  onSubmit() {
    let fag = true;
    const selectedError = [];

    this.dailyReportSourceComponent.forEach(component => {
      const error = component.isValidForm();
      if (!error.fag) {
        selectedError.push(error);
        console.log('invalid');
        fag = false;
      }
    });

    this.dailyReportFieldsComponent.forEach(component => {
      if (!component.isValidForm()) {
        console.log('invalid');
        fag = false;
      }
    });

    this.openTabError(selectedError);

    if (this.form.valid && fag) {
      Object.keys(this.dailyReportModel.regularPouring).forEach(key => {
        this.dailyReportModel.regularPouring[key] = Number(this.form.controls[key].value);
      });
      Object.keys(this.dailyReportModel.selfPouring).forEach(key => {
        this.dailyReportModel.selfPouring[key] = Number(this.form.controls[`self_${key}`].value);
      });
      Object.keys(this.dailyReportModel).forEach(key => {
        if (key !== 'regularPouring' && key !== 'selfPouring' && key !== 'ratingSources'
          && key !== 'latestRatings' && key !== 'reportUserId') {
          this.dailyReportModel[key] = Number(this.form.controls[key].value);
        }
      });
      this.deleteUid();
      this.dailyReportModel.latestRatings = this.ratingTotalData;
      if (this.reportId > 0) {
        this.update();
      } else {
        this.save();
      }
    }
  }

  openTabError(selectedError = []) {
    const errorLength = selectedError.length - 1;
    for (let i = errorLength; i >= 0; i--) {
      const error = selectedError[i];
      const itemSource = this.templateSources.find(x => x.id === error.sourceId);
      if (itemSource) {
        itemSource.expanded = true;
        if (error.tabId === 4) {
          itemSource.selectedIndex = 2;
        }
        if (error.tabId === 2) {
          itemSource.selectedIndex = 1;
        }
        if (error.tabId === 1) {
          itemSource.selectedIndex = 0;
        }
        this.ref.markForCheck();
      }
    }
  }

  deleteUid() {
    const itemsDelete = [];
    this.dailyReportModel.ratingSources.forEach(source => {
      if (source.ratingItems.length === 0) {
        itemsDelete.push(source.sourceId);
      }
      source.ratingItems.forEach(item => {
        delete item['uid'];
        if (source.sourceId !== 1) {
          delete item['userId'];
        }
        if (!item.appointmentDate) {
          delete item['appointmentDate'];
        }
      });
    });
    itemsDelete.forEach(id => {
      this.dailyReportModel.ratingSources = this.dailyReportModel.ratingSources.filter(x => x.sourceId !== id);
    });
  }

  save() {
    this.dailyReportModel.reportUserId = this.reportUserId;
    this.dailyReportService.create(this.dailyReportModel).subscribe(() => {
      this.snackbar.open({ message: 'Thêm mới thành công!', type: 'SUCCESS' });
      this.router.navigateByUrl(Routing.DAILYREPORTS);
    });
  }

  update() {
    this.dailyReportService.update(this.reportId, this.dailyReportModel).subscribe(() => {
      this.snackbar.open({ message: 'Cập nhật thành công!', type: 'SUCCESS' });
      this.router.navigateByUrl(Routing.DAILYREPORTS);
    });
  }

  onCancel() {
    this.router.navigateByUrl(Routing.DAILYREPORTS);
  }

  getReportDate() {
    if (UserProfile.getRole() === ('Administrator' || 'Manager') && Number(this.reportUserId) === 0) {
      this.openDialogUser();
    } else {
      this.dailyReportService.getReportDate(this.reportUserId).subscribe((response: any) => {
        this.reportDate = Utils.transform(response.reportDate);
        if (response.reportUserName) {
          this.reportUserName = response.reportUserName;
        }
        if (response.reportDate === 0) {
          this.router.navigateByUrl(Routing.DAILYREPORTS);
        }
        this.latestRatings = response.latestRatings;
        this.setLatestRatings();
        this.ref.markForCheck();
      });
    }
  }

  setLatestRatings() {
    if (this.ratingTotalSources.length > 0 && this.latestRatings) {
      this.ratingTotalSources.forEach(s => {
        const filter = this.latestRatings[s.id];
        filter ? s.value = Number(filter) : s.value = 0;
      });
    }
  }

  openDialogUser = () => {
    this.dialog.open({
      component: DialogUserComponent
    }).subscribe(res => {
      if (res && res.userId) {
        this.router.navigate([`${Routing.DAILYREPORTS}/${Routing.NEW}`], { queryParams: { reportUserId: res.userId } });
      } else {
        this.router.navigateByUrl(Routing.DAILYREPORTS);
      }
    });
  }

  opened(item) {
    item.expanded = true;
  }
  closed(item) {
    item.expanded = false;
  }
  onTabChanged(event, item) {
    item.selectedIndex = event.index;
  }
}
