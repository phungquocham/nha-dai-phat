import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SourcesService } from 'src/app/shared/services/api/sources.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DashboardResolver } from './dashboard.resolver';

export const routes = [
  {
    path: '',
    // resolve: {
    //   resolverData: DashboardResolver
    // },
    component: DashboardComponent, pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ScrollingModule
  ],
  providers: [
    SourcesService,
    DashboardResolver
  ],
  declarations: [
    DashboardComponent,
  ]
})
export class DashboardModule { }
