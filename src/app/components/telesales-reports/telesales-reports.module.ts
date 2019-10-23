import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TelesalesReportsComponent } from './telesales-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DailyReportService } from 'src/app/shared/services/api/daily-reports.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TelesalesReportService } from 'src/app/shared/services/api/telesales-reports.service';

export const routes: Routes = [
  {
    path: '', component: TelesalesReportsComponent, pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    DailyReportService,
    TelesalesReportService,
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  declarations: [
    TelesalesReportsComponent
  ]
})
export class TelesalesReportsModule { }
