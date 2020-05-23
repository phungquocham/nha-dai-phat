import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {forkJoin, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {REGEX} from 'src/app/shared/helpers/regex';
import {ContactsService} from 'src/app/shared/services/api/contacts.service';
import {Routing} from 'src/app/shared/helpers/routing';
import {SnackbarService} from 'src/app/shared/services/others/snackbar.service';

@Component({
  selector: 'app-contact-new',
  templateUrl: './contact-new.component.html',
  styleUrls: ['./contact-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactNewComponent implements OnInit, OnDestroy {
  form: FormGroup;
  contactId = 0;
  ngUnsubscribe = new Subject();
  removable = true;
  removableEmail = true;
  removableAddress = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  phoneList: IChip[] = [];
  emailList: IChip[] = [];
  addressList: IChip[] = [];
  @ViewChild('chipList') chipList;
  @ViewChild('chipListEmail') chipListEmail;
  @ViewChild('chipListAddress') chipListAddress;

  constructor(
      private fb: FormBuilder,
      private ref: ChangeDetectorRef,
      private activatedRoute: ActivatedRoute,
      private contactsService: ContactsService,
      private router: Router,
      private snackbar: SnackbarService,
  ) {
    this.form = this.fb.group({
      name: [''],
      phones: [''],
      emails: [''],
      address: ['']
    });

    this.activatedRoute.queryParams.subscribe(() => {
      this.activatedRoute.params.subscribe((params: Params) => {
        if (params.id > 0) {
          this.contactId = params.id;
          this.getId();
        } else {
          this.onRedirect();
        }
      });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.getInit();
  }

  getId() {
    this.contactsService.getId(this.contactId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      if (response) {
        this.phoneList = [];
        (response.phones || []).forEach(element => {
          this.phoneList.push({name: element});
        });
        this.emailList = [];
        (response.emails || []).forEach(element => {
          this.emailList.push({name: element});
        });
        this.addressList = [];
        (response.addresses || []).forEach(element => {
          this.addressList.push({name: element});
        });
        this.form.controls['name'].setValue(response.name);
      }
    });
  }

  getInit() {
    return forkJoin(
    ).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.ref.markForCheck();
    });
  }

  onSubmit() {
    this.activePhones();
    if (this.chipList.errorState) {
      return;
    }
    if (this.chipListEmail.errorState) {
      return;
    }
    const data = {
      name: this.form.controls.name.value,
      phones: this.phoneList.map(x => x.name),
      emails: this.emailList.map(x => x.name),
      addresses: this.addressList.map(x => x.name)
    };
    this.contactsService.update(this.contactId, data).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.snackbar.open({message: 'Cập nhật thành công !.', type: 'SUCCESS'});
      this.onRedirect();
    });
  }

  activePhones() {
    if (this.phoneList.length > 0 && !this.form.controls.phones.value) {
      this.chipList.errorState = false;
    } else {
      this.chipList.errorState = true;
    }
  }

  addPhone(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const dataInput = (value || '').trim();
    if (dataInput && isValidPhone(dataInput)) {
      if (!this.phoneList.find(x => x.name === dataInput)) {
        this.phoneList.push({name: dataInput});
      }
      if (input) {
        input.value = '';
      }
      this.chipList.errorState = false;
      this.form.controls['phones'].setValue('');
    } else if (dataInput) {
      this.chipList.errorState = true;
    } else {
      this.activePhones();
    }
  }

  removePhone(item: IChip): void {
    const index = this.phoneList.indexOf(item);
    if (index >= 0) {
      this.phoneList.splice(index, 1);
    }
    this.activePhones();
  }

  addEmail(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    const dataInput = (value || '').trim();
    if (dataInput && dataInput.match(REGEX.EMAIL)) {
      if (!this.emailList.find(x => x.name === dataInput)) {
        this.emailList.push({name: dataInput});
      }
      if (input) {
        input.value = '';
      }
      this.chipListEmail.errorState = false;
    } else if (dataInput) {
      this.chipListEmail.errorState = true;
    } else {
      this.chipListEmail.errorState = false;
    }
  }

  removeEmail(item: IChip): void {
    const index = this.emailList.indexOf(item);
    if (index >= 0) {
      this.emailList.splice(index, 1);
    }
  }

  addAddress(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    const dataInput = (value || '').trim();
    if (dataInput) {
      if (!this.addressList.find(x => x.name === dataInput)) {
        this.addressList.push({name: dataInput});
      }
      if (input) {
        input.value = '';
      }
    }
  }

  removeAddress(item: IChip): void {
    const index = this.addressList.indexOf(item);
    if (index >= 0) {
      this.addressList.splice(index, 1);
    }
  }

  onRedirect() {
    this.router.navigate([`/${Routing.CONTACTS}`]);
  }
}

export function isValidPhone(phone) {
  const charat = (phone || '').charAt(0);
  // tslint:disable-next-line:radix
  if ((parseFloat(charat) === parseInt(charat)) && !isNaN(charat) && parseInt(charat) === 0 && phone.length === 10 && Number(phone) > 0) {
    return true;
  } else {
    return false;
  }
}

export interface IChip {
  name: string;
}
