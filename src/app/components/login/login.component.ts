import {
  Component,
  AfterViewInit,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';

import { AuthenticationService } from '../../shared/services/others/authentication.service';
import { SnackbarService } from '../../shared/services/others/snackbar.service';
import { WindowService } from 'src/app/shared/services/others/window.service';
import { REGEX } from 'src/app/shared/helpers/regex';
import { SNACKBAR } from 'src/app/shared/helpers/snackbar';
import { ExportExcelService } from 'src/app/shared/services/api/export-excel.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  windowRef: any;
  verificationCode: string;
  showElementCodeForm = false;
  isError = false;

  dataForExcel = [];
  empPerformance = [
    {
      ID: 10011,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'Jan',
      YEAR: 2020,
      SALES: 132412,
      CHANGE: 12,
      LEADS: 35,
    },
    {
      ID: 10012,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'Feb',
      YEAR: 2020,
      SALES: 232324,
      CHANGE: 2,
      LEADS: 443,
    },
    {
      ID: 10013,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'Mar',
      YEAR: 2020,
      SALES: 542234,
      CHANGE: 45,
      LEADS: 345,
    },
    {
      ID: 10014,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'Apr',
      YEAR: 2020,
      SALES: 223335,
      CHANGE: 32,
      LEADS: 234,
    },
    {
      ID: 10015,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'May',
      YEAR: 2020,
      SALES: 455535,
      CHANGE: 21,
      LEADS: 12,
    },
  ];

  constructor(
    public fb: FormBuilder,
    public router: Router,
    private authService: AuthenticationService,
    private windowService: WindowService,
    private snackbar: SnackbarService,
    private auth: AuthenticationService,
    public exportExcel: ExportExcelService
  ) {
    this.form = this.fb.group({
      phone: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(REGEX.PHONE),
        ]),
      ],
      verifyCode: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(REGEX.NUMBER_LENGTH_6),
        ]),
      ],
    });
  }

  ngOnInit() {
    this.windowRef = this.windowService.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
      }
    );
    this.windowRef.recaptchaVerifier.render();
  }

  ngAfterViewInit() {}

  private replaceAt(text: string, index: number, replace: string) {
    return text.substring(0, index) + replace + text.substring(index + 1);
  }

  private snackbarError(message: string) {
    this.snackbar.open({ type: SNACKBAR.TYPE.ERROR, message });
  }

  onSubmit(): void {
    if (this.form.controls.phone.valid) {
      const phone = this.form.value.phone;
      this.showElementCodeForm = true;
      this.authService
        .signInWithPhoneNumber({
          phoneNumber: this.replaceAt(phone, 0, '+84'),
          applicationVerifier: this.windowRef.recaptchaVerifier,
        })
        .then((confirmationResult) => {
          console.log(
            'SUBMIT LOGIN',
            this.replaceAt(phone, 0, '+84'),
            this.windowRef.recaptchaVerifier
          );
          console.log('SUBMIT RESULT', confirmationResult);
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          this.windowRef.confirmationResult = confirmationResult;
        })
        .catch((error) => {
          this.snackbarError('Đã xảy ra lỗi');
          this.showElementCodeForm = false;
          console.log(error);
          // Error; SMS not sent
          // ...
        });
    }
  }

  verifyLoginCode() {
    this.verificationCode = this.form.value.verifyCode;
    console.log('AAAAAA', this.windowRef, this.windowRef.confirmationResult);
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then((_) => {
        this.router.navigate(['/']);
      })
      .catch((error) => {
        this.isError = true;
        this.snackbarError('Sai mã đăng nhập. Vui lòng thử lại.');
        console.log(error);
      });
  }

  exportToExcel() {
    this.empPerformance.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row));
    });

    const reportData = {
      title: 'Employee Sales Report - Jan 2020',
      data: this.dataForExcel,
      headers: Object.keys(this.empPerformance[0]),
    };

    console.log(reportData);

    this.exportExcel.exportExcel(reportData);
  }
}
