import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, SimpleChanges,
  OnChanges
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { numericNumberReg } from 'src/app/shared/helpers/regex';
import { Utils } from 'src/app/shared/helpers/utilities';

@Component({
  selector: 'app-daily-report-source',
  templateUrl: './daily-report-source.component.html',
  styleUrls: ['./daily-report-source.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DailyReportSourceComponent implements OnChanges {
  form: FormGroup;
  @Input() dataProjects = [];
  @Input() dataRating = [];
  @Output() output: EventEmitter<any> = new EventEmitter();
  @Input() sourceId = 0;
  @Input() tabId = 0;
  @Input() uid = 0;
  @Input() setValue = null;
  onlySelf = { emitEvent: true, onlySelf: true };
  @Input() usersList = [];
  appointmentDate = new Date();

  constructor(
    private fb: FormBuilder
  ) {
    const noRequiredPattern = [Validators.required, Validators.min(0), Validators.pattern(numericNumberReg)];
    this.form = this.fb.group({
      rating: [0, Validators.compose(noRequiredPattern)],
      project: [0, Validators.compose(noRequiredPattern)],
      quantity: [0, Validators.compose(noRequiredPattern)],
      userId: [0, Validators.compose(noRequiredPattern)],
      appointmentDate: ['']
    });
    this.form.valueChanges.subscribe((e) => {
      this.setEventForm(e);
      this.eventEmit();
    });
  }

  ngOnChanges(change: SimpleChanges) {
    if (this.setValue && this.sourceId && this.tabId) {
      if (this.sourceId === this.setValue.sourceId && this.tabId === this.setValue.tabId) {
        this.form.controls['rating'].setValue(this.setValue.ratingId);
        this.form.controls['project'].setValue(this.setValue.projectId);
        this.form.controls['quantity'].setValue(this.setValue.count);
        this.form.controls['userId'].setValue(this.setValue.userId);
        if (this.setValue.appointmentDate) {
          const transform = Utils.transform(this.setValue.appointmentDate);
          const value = Utils.convertDateTime(transform);
          this.form.controls['appointmentDate'].setValue(value);
        }
      }
    }
  }

  isValidForm() {
    let fag = true;
    Object.keys(this.form.controls).forEach(key => {
      if (this.form.controls[key].errors) {
        fag = false;
      }
    });
    return {
      fag: fag,
      sourceId: this.sourceId,
      tabId: this.tabId
    };
  }

  setEventForm(e: any) {
    if (e.rating === 4 || e.rating === 13) {
      this.appointmentDateRequired();
    } else {
      this.appointmentDateNotRequired();
    }
    if (this.tabId === 2 || this.tabId === 4) {
      if (e.rating > 0 || e.project > 0 || e.quantity > 0 || e.userId > 0 || e.appointmentDate) {
        this.ratingRequired();
        this.projectRequired();
        this.quantityRequired();
        if (this.sourceId === 1) {
          this.userRequired();
        }
      } else {
        this.ratingNotRequired();
        this.projectNotRequired();
        this.quantityNotRequired();
        this.userNotRequired();
      }
    } else {
      if (e.rating > 0 || e.project > 0 || e.quantity > 0 || e.userId > 0 || e.appointmentDate) {
        if (e.rating === 1 || e.rating === 2) {
          this.disableProject();
          this.quantityRequired();
        } else {
          this.enableProject();
          this.ratingRequired();
          this.quantityRequired();
        }
        if (this.sourceId === 1) {
          this.userRequired();
        }
      } else {
        this.ratingNotRequired();
        this.projectNotRequired();
        this.quantityNotRequired();
        this.userNotRequired();
      }
    }
  }

  disableProject() {
    this.form.get('project').setValue(0, { emitEvent: false });
    this.form.get('project').setValidators([Validators.min(0)]);
    this.form.get('project').disable(this.onlySelf);
    this.form.get('project').updateValueAndValidity(this.onlySelf);
  }

  enableProject() {
    this.form.get('project').enable(this.onlySelf);
    this.form.get('project').setValidators([Validators.required, Validators.min(1)]);
    this.form.get('project').updateValueAndValidity(this.onlySelf);
    this.form.get('project').markAsTouched(this.onlySelf);
  }

  ratingNotRequired() {
    this.form.get('rating').setValidators([Validators.min(0)]);
    this.form.get('rating').updateValueAndValidity(this.onlySelf);
  }

  ratingRequired() {
    this.form.get('rating').setValidators([Validators.required, Validators.min(1)]);
    this.form.get('rating').updateValueAndValidity(this.onlySelf);
    this.form.get('rating').markAsTouched(this.onlySelf);
  }

  projectNotRequired() {
    this.form.get('project').setValidators([Validators.min(0)]);
    this.form.get('project').updateValueAndValidity(this.onlySelf);
  }

  projectRequired() {
    this.form.get('project').setValidators([Validators.required, Validators.min(1)]);
    this.form.get('project').updateValueAndValidity(this.onlySelf);
    this.form.get('project').markAsTouched(this.onlySelf);
  }

  quantityNotRequired() {
    this.form.get('quantity').setValidators([Validators.min(0)]);
    this.form.get('quantity').updateValueAndValidity(this.onlySelf);
  }

  quantityRequired() {
    this.form.get('quantity').setValidators([Validators.required, Validators.min(1)]);
    this.form.get('quantity').updateValueAndValidity(this.onlySelf);
    this.form.get('quantity').markAsTouched(this.onlySelf);
  }

  userNotRequired() {
    this.form.get('userId').setValidators([Validators.min(0)]);
    this.form.get('userId').updateValueAndValidity(this.onlySelf);
  }

  userRequired() {
    this.form.get('userId').setValidators([Validators.required, Validators.min(1)]);
    this.form.get('userId').updateValueAndValidity(this.onlySelf);
    this.form.get('userId').markAsTouched(this.onlySelf);
  }

  appointmentDateNotRequired() {
    this.form.get('appointmentDate').setValue('', { emitEvent: false });
    this.form.get('appointmentDate').setValidators([Validators.nullValidator]);
    this.form.get('appointmentDate').updateValueAndValidity(this.onlySelf);
  }

  appointmentDateRequired() {
    this.form.get('appointmentDate').setValidators([Validators.required]);
    this.form.get('appointmentDate').updateValueAndValidity(this.onlySelf);
    this.form.get('appointmentDate').markAsTouched(this.onlySelf);
  }

  getValueForm() {
    return {
      uid: this.uid,
      ratingId: this.form.controls['rating'].value,
      projectId: this.form.controls['project'].value,
      count: this.form.controls['quantity'].value,
      userId: this.form.controls['userId'].value,
      appointmentDate: this.form.controls['appointmentDate'].value ?
        Utils.convertDateString(this.form.controls['appointmentDate'].value) : ''
    };
  }

  eventEmit() {
    this.output.emit(this.getValueForm());
  }

  onfocus() {
    this.output.emit({ add: true });
  }

  deleteAdditional() {
    this.output.emit({ delete: true, uid: this.uid });
  }
}
