import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {numericNumberReg} from 'src/app/shared/helpers/regex';

@Component({
  selector: 'app-contact-sources-fields',
  templateUrl: './contact-sources-fields.component.html',
  styleUrls: ['./contact-sources-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ContactSourcesFieldsComponent implements OnChanges {
  form: FormGroup;
  @Output() output: EventEmitter<any> = new EventEmitter();
  @Input() data: Idata;
  @Input() usersList = [];
  @Input() index = 0;
  @Input() length = 0;
  @Input() oldValue = 0;

  constructor(
      private fb: FormBuilder,
      private ref: ChangeDetectorRef,
  ) {
    const noRequiredPattern = [Validators.required, Validators.min(0), Validators.pattern(numericNumberReg)];
    this.form = this.fb.group({
      userId: [0, Validators.compose(noRequiredPattern)],
      quantity: [0],
      fromTo: ['']
    });
    this.form.get('fromTo').disable({emitEvent: false, onlySelf: true});
  }

  ngOnChanges(change: SimpleChanges) {
    if (this.data.quantity && this.data.userId) {
      this.form.controls['quantity'].setValue(+this.data.quantity);
      this.form.controls['userId'].setValue(+this.data.userId);
      this.oldValue = +this.data.quantity;
      this.ref.markForCheck();
    }
  }

  getValueForm() {
    return {
      uid: this.data.uid,
      userId: this.form.controls['userId'].value,
      quantity: this.form.controls['quantity'].value
    };
  }

  eventEmit() {
    this.output.emit(this.getValueForm());
  }

  onfocus() {
    if (this.index + 1 === this.length) {
      this.output.emit({add: true, uid: this.data.uid});
    }
  }

  focusout() {
    setTimeout(() => {
      if (this.oldValue !== this.form.controls['quantity'].value) {
        this.eventEmit();
      }
    }, 500);
  }

  onDelete() {
    this.output.emit({delete: true, uid: this.data.uid});
  }
}

interface Idata {
  uid: String;
  userId: Number;
  quantity: Number;
  from: Number;
  to: Number;
}
