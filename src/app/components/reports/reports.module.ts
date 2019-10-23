import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { ReportsComponent } from './reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportsService } from 'src/app/shared/services/api/reports.service';
import { SourcesService } from 'src/app/shared/services/api/sources.service';
import { ProjectsService } from 'src/app/shared/services/api/projects.service';
import { RatingsService } from 'src/app/shared/services/api/ratings.service';
import { ReportsResolver } from './reports.resolver';
import { TeamsService } from 'src/app/shared/services/api/teams.service';
import { UsersService } from 'src/app/shared/services/api/users.service';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import {
  CustomSelectAutocompleteModule
} from 'src/app/shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.module';
export const routes = [
  {
    path: '',
    // resolve: {
    //   resolverData: ReportsResolver
    // },
    component: ReportsComponent
  }
];

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    CustomSelectAutocompleteModule
  ],
  providers: [
    ReportsService,
    SourcesService,
    ProjectsService,
    RatingsService,
    ReportsResolver,
    TeamsService,
    UsersService,
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class ReportsModule { }
