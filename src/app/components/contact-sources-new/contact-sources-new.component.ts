import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {UsersService} from 'src/app/shared/services/api/users.service';
import {takeUntil} from 'rxjs/operators';
import * as _ from 'lodash';
import {v4 as uuid} from 'uuid';
import {ContactSourceService} from 'src/app/shared/services/api/contact-sources.service';
import {SnackbarService} from 'src/app/shared/services/others/snackbar.service';
import {TeamsService} from '../../shared/services/api/teams.service';
import {CustomSelectAutocompleteComponent} from '../../shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.component';
import {ContactSourcesFieldsComponent} from './contact-sources-fields/contact-sources-fields.component';
import {Utils} from "../../shared/helpers/utilities";

@Component({
  selector: 'app-contact-sources-new',
  templateUrl: './contact-sources-new.component.html',
  styleUrls: ['./contact-sources-new.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ContactSourceService]
})
export class ContactSourcesNewComponent implements OnInit, OnDestroy {
  @ViewChildren('ContactSourcesFieldsComponentView') ContactSourcesFieldsComponentView: QueryList<ContactSourcesFieldsComponent>;
  form: FormGroup;
  isButton = false;
  ngUnsubscribe = new Subject();
  id = 0;
  assignedDate = 0;
  assignedDateLabel = '';
  templateSources = [];
  data = [];
  isLoading = false;
  sourceName = '';
  //
  quantity = 1;
  start = 0;
  //
  name = '';
  from = 0;
  to = 0;
  teamList = [];
  usersList = [];
  teamSelected = [];
  usersSelected = [];
  @ViewChild('selectTeams') selectTeams: CustomSelectAutocompleteComponent;
  @ViewChild('selectUsers') selectUsers: CustomSelectAutocompleteComponent;

  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private contactSourceService: ContactSourceService,
      private ref: ChangeDetectorRef,
      private snackbar: SnackbarService,
      private teamService: TeamsService,
      private usersService: UsersService
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.assignedDate) {
        this.assignedDate = params.assignedDate;
        this.assignedDateLabel = ` - ${Utils.transform(this.assignedDate)}`;
      }
      if (params.id > 0) {
        this.id = params.id;
      } else {
        this.id = 0;
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.getUser();
    this.getList();
    this.getGroup();
    this.getTeam();
  }

  getUser() {
    this.usersService.getUserName().pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.usersList = res;
    });
  }

  getList() {
    this.contactSourceService.getListId(this.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
      this.sourceName = response.name;
      this.name = response.name;
      this.from = response.fromContactId;
      this.to = response.toContactId;
      this.start = response.fromContactId;
      this.ref.markForCheck();
    });
  }

  eventEmit(e) {
    console.log(e);
    if (e.add) {
      const findIndex = this.templateSources.findIndex(s => s.uid === e.uid);
      if (findIndex + 1 === this.templateSources.length) {
        this.templateSources.push({
          uid: uuid(),
          userId: 0,
          quantity: 0,
          from: 0,
          to: 0
        });
      }
    } else if (e.delete) {
      this.templateSources = this.templateSources.filter(s => s.uid !== e.uid);
      this.onChangeData(e);
    } else {
      this.onChangeData(e);
    }
  }

  onChangeData(e: any) {
    this.isLoading = true;
    setTimeout(() => {
      const find = this.templateSources.find(s => s.uid === e.uid);
      if (find) {
        find.quantity = e.quantity;
      }
      //
      const oldData = _.cloneDeep(this.templateSources);
      let newData = [];
      let fag = true;
      let fag_max = true;
      //
      oldData.forEach((el, index) => {
        if (el.quantity >= 0 && fag_max) {
          //
          if (index === 0) {
            el.from = Number(this.start);
            el.to = Number(this.start) + Number(el.quantity) - 1;
            // trường hợp nó chỉnh sửa mà >= max
            if (e.quantity >= this.to) {
              fag_max = false;
              el.quantity = this.to - this.start;
              el.to = this.to;
            }
            newData.push(el);
          } else if (fag) {
            //
            const preview = oldData[index - 1];
            if ((preview.to + 1 + el.quantity) <= this.to) {
              el.from = Number(preview.to) + 1;
              el.to = Number(preview.to) + Number(el.quantity);
              newData.push(el);
            } else {
              //
              el.quantity = this.to - (Number(preview.to));
              el.from = Number(preview.to) + 1;
              el.to = this.to;
              fag = false;
              newData.push(el);
            }
          }
        }
      });
      newData = newData.filter(x => x.quantity >= 0);
      this.templateSources = [];
      this.templateSources = newData;
      // this.ref.markForCheck();
      this.isLoading = false;
      this.ref.detectChanges();
      console.log('update');
    }, 0);
  }

  onCreate() {
    if (!this.checkCreate()) {
      return false;
    }
    this.isButton = true;
    this.isLoading = true;
    setTimeout(() => {
      this.templateSources = [];
      if (this.usersSelected.length === 0) {
        this.usersSelected = this.usersList.map(res => res.id);
      }
      let fag = true;
      this.usersSelected.forEach(el => {
        //
        if (this.templateSources.length === 0) {
          this.templateSources.push({
            uid: uuid(),
            userId: el,
            quantity: this.quantity,
            from: Number(this.start),
            to: Number(this.start) + Number(this.quantity) - 1
          });
        } else if (fag) {
          const find = this.templateSources[this.templateSources.length - 1];
          //
          if ((find.to + 1 + this.quantity) <= this.to) {
            this.templateSources.push({
              uid: uuid(),
              userId: el,
              quantity: Number(this.quantity),
              from: Number(find.to) + 1,
              to: Number(find.to) + Number(this.quantity)
            });
          } else {
            //
            this.templateSources.push({
              uid: uuid(),
              userId: el,
              quantity: this.to - (Number(find.to)),
              from: Number(find.to) + 1,
              to: this.to
            });
            fag = false;
          }
        }
      });
      this.templateSources = this.templateSources.filter(x => x.quantity > 0);
      this.isLoading = false;
      this.ref.detectChanges();
      console.log('created');
    }, 0);
  }

  getGroup() {
    this.teamService.getTeamName().pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.teamList = res || [];
      this.selectTeams.setData(this.teamList);
      this.selectTeams.setSelectedDataBaseOnValue(this.teamSelected);
    });
  }

  getTeam() {
    this.usersService.getUserName().pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.usersList = res || [];
      this.selectUsers.setData(this.usersList);
      this.selectUsers.setSelectedDataBaseOnValue(this.usersSelected);
    });
  }

  getSelectedTeams(selected) {
    this.teamSelected = selected;
  }

  getSelectedusers(selected) {
    this.usersSelected = selected;
  }

  onSubmit() {
    this.ContactSourcesFieldsComponentView.forEach(component => {
      const item = component.getValueForm();
      const find = this.templateSources.find(el => el.uid === item.uid);
      if (find) {
        find.userId = item.userId;
      }
    });

    const request = this.setData();
    if (request.length > 0) {
      this.isLoading = true;
      this.ref.markForCheck();
      if (+this.assignedDate > 0) {
        this.contactSourceService.assignedDate(this.id, request, this.assignedDate).subscribe(() => {
          this.redirect();
        });
      } else {
        this.contactSourceService.create(this.id, request).subscribe(() => {
          this.redirect();
        });
      }
    }
  }

  redirect() {
    this.snackbar.open({message: 'Thêm mới thành công!', type: 'SUCCESS'});
    this.onCancel();
  }

  setData() {
    const request = [];
    this.templateSources.forEach(e => {
      if (e.userId && e.from && e.to) {
        request.push({
          assignedUserId: e.userId,
          fromContactId: e.from,
          toContactId: e.to
        });
      }
    });
    return request;
  }

  onCancel() {
    this.router.navigate([`/contact-sources/${this.id}`]);
  }

  outQuantity() {
    if (this.to - this.from + 1 <= this.quantity) {
      this.quantity = this.to - this.from + 1;
    }
    if (this.quantity <= 0) {
      this.quantity = 1;
    }
  }

  outStart() {
    if (this.start < this.from || this.start > this.to) {
      this.start = this.from;
    }
  }

  checkCreate() {
    if ((Number(this.start) + Number(this.quantity) - 1) > this.to) {
      this.snackbar.open({message: 'Số lượng và Bắt đầu không hợp lệ!.', type: 'ERROR'});
      return false;
    }
    return true;
  }
}
