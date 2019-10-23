import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DailyReportService } from 'src/app/shared/services/api/daily-reports.service';
import { DailyReportNewComponent } from './daily-report-new.component';
import { DailyReportSourceModule } from './daily-report-source/daily-report-source.module';
import { DailyReportFieldsModule } from './daily-report-fields/daily-report-fields.module';

export const routes = [
  { path: '', component: DailyReportNewComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DailyReportSourceModule,
    DailyReportFieldsModule
  ],
  providers: [
    DailyReportService
  ],
  entryComponents: [DailyReportNewComponent],
  declarations: [DailyReportNewComponent],
  exports: [DailyReportNewComponent]
})
export class DailyReportNewModule { }
