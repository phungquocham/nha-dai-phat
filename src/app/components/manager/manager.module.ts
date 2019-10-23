import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { ManagerComponent } from './manager.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputBasicModule } from './input-basic/input-basic.module';
import { SourcesService } from 'src/app/shared/services/api/sources.service';
import { ProjectsService } from 'src/app/shared/services/api/projects.service';
import { TeamsService } from 'src/app/shared/services/api/teams.service';
import { UsersService } from 'src/app/shared/services/api/users.service';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ReportsService } from 'src/app/shared/services/api/reports.service';
import { RatingsService } from 'src/app/shared/services/api/ratings.service';

export const routes = [
  {
    path: '',
    component: ManagerComponent
  }
];

@NgModule({
  declarations: [ManagerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    InputBasicModule,
    PipesModule
  ],
  providers: [
    SourcesService,
    ProjectsService,
    TeamsService,
    UsersService,
    RatingsService
  ]
})
export class ManagerModule { }
