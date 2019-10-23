import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DailyReportsComponent } from './daily-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DailyReportService } from 'src/app/shared/services/api/daily-reports.service';
import { TeamsService } from 'src/app/shared/services/api/teams.service';
import { UsersService } from 'src/app/shared/services/api/users.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ProjectsService } from 'src/app/shared/services/api/projects.service';
import { CustomSelectAutocompleteModule } from '../../shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.module';

export const routes: Routes = [
  {
    path: '', component: DailyReportsComponent, pathMatch: 'full'
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
    DailyReportService,
    TeamsService,
    UsersService,
    ProjectsService,
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  declarations: [
    DailyReportsComponent
  ]
})
export class DailyReportsModule { }
