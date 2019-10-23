import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, SimpleChanges, OnChanges,
  ViewChild, ElementRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { numericNumberReg } from 'src/app/shared/helpers/regex';

@Component({
  selector: 'app-daily-report-fields',
  templateUrl: './daily-report-fields.component.html',
  styleUrls: ['./daily-report-fields.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DailyReportFieldsComponent implements OnChanges {
  form: FormGroup;
  @Input() label = '';
  @Input() id = '';
  @Output() output: EventEmitter<any> = new EventEmitter();
  @Input() value = 0;
  // @ViewChild('myInput', {static: false}) myInput: ElementRef;

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      rating: [0, Validators.compose([Validators.required, Validators.min(0), Validators.pattern(numericNumberReg)])]
    });
    this.form.valueChanges.subscribe((e) => {
      this.eventEmit();
    });
  }

  ngOnChanges(change: SimpleChanges) {
    if (this.value) {
      this.form.controls['rating'].setValue(this.value);
    }
  }

  isValidForm() {
    // if (!this.form.valid) {
    //   this.myInput.nativeElement.focus();
    // }
    return this.form.controls['rating'].valid;
  }

  eventEmit() {
    this.output.emit({
      id: this.id,
      value: this.form.controls['rating'].value
    });
  }
}
