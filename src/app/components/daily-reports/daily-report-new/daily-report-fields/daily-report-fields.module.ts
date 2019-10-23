import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DailyReportFieldsComponent } from './daily-report-fields.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [DailyReportFieldsComponent],
  declarations: [DailyReportFieldsComponent],
  exports: [DailyReportFieldsComponent]
})
export class DailyReportFieldsModule { }
