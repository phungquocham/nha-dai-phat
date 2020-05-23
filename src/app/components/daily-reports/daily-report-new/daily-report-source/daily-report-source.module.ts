import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DailyReportService } from 'src/app/shared/services/api/daily-reports.service';
import { DailyReportSourceComponent } from './daily-report-source.component';
import {
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_FORMATS,
} from '@angular/material-moment-adapter';

@NgModule({
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule],
  providers: [
    DailyReportService,
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  entryComponents: [DailyReportSourceComponent],
  declarations: [DailyReportSourceComponent],
  exports: [DailyReportSourceComponent],
})
export class DailyReportSourceModule {}
