import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RatingReportsComponent } from './rating-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersService } from 'src/app/shared/services/api/users.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RatingReportsService } from 'src/app/shared/services/api/rating-reports.service';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { DailyReportService } from 'src/app/shared/services/api/daily-reports.service';
import { TeamsService } from 'src/app/shared/services/api/teams.service';
import { CustomSelectAutocompleteModule } from 'src/app/shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.module';

export const routes: Routes = [
  {
    path: '', component: RatingReportsComponent, pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CustomSelectAutocompleteModule
  ],
  providers: [
    RatingReportsService,
    UsersService,
    DailyReportService,
    TeamsService,
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  declarations: [
    RatingReportsComponent
  ]
})
export class RatingReportsModule { }
