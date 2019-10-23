import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './components/pages.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { Routing } from './shared/helpers/routing';
import { CustomPreloader } from './custom.preloader';


const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: ``,
        loadChildren: './components/dashboard/dashboard.module#DashboardModule',
        data: { preload: true }
      },
      {
        path: Routing.MANAGER,
        loadChildren: './components/manager/manager.module#ManagerModule',
      },
      {
        path: Routing.DAILYREPORTS,
        loadChildren: './components/daily-reports/daily-reports.module#DailyReportsModule',
      },
      {
        path: Routing.REPORTS,
        loadChildren: './components/reports/reports.module#ReportsModule',
      },
      {
        path: Routing.DAILYREPORTS,
        loadChildren: './components/daily-reports/daily-reports.module#DailyReportsModule'
      },
      {
        path: Routing.DAILYREPORTS + '/new',
        loadChildren: './components/daily-reports/daily-report-new/daily-report-new.module#DailyReportNewModule'
      },
      {
        path: Routing.DAILYREPORTS + '/:id',
        loadChildren: './components/daily-reports/daily-report-new/daily-report-new.module#DailyReportNewModule'
      },
      {
        path: Routing.RATING_REPORTS,
        loadChildren: './components/rating-reports/rating-reports.module#RatingReportsModule'
      },
      {
        path: Routing.CONTACTS,
        loadChildren: './components/contacts/contacts.module#ContactsModule'
      },
      {
        path: `${Routing.CONTACTS}/${Routing.NEW}`,
        loadChildren: './components/contacts/contact-new/contact-new.module#ContactNewModule'
      },
      {
        path: `${Routing.CONTACTS}/:id`,
        loadChildren: './components/contacts/contact-new/contact-new.module#ContactNewModule'
      },
      {
        path: Routing.TELESALES_REPORTS,
        loadChildren: './components/telesales-reports/telesales-reports.module#TelesalesReportsModule'
      },
      {
        path: Routing.CONTACT_SOURCES,
        loadChildren: './components/contact-sources/contact-sources.module#ContactSourcesModule'
      },
      {
        path: Routing.CONTACT_SOURCES + '/:id',
        loadChildren: './components/contact-sources-detail/contact-sources-detail.module#ContactSourcesDetailModule'
      },
      {
        path: `${Routing.CONTACT_SOURCES}/:id/assignments`,
        loadChildren: './components/contact-sources-new/contact-sources-new.module#ContactSourcesNewModule'
      },
      {
        path: `${Routing.CONTACT_SOURCES}/:id/assignments/:assignedDate`,
        loadChildren: './components/contact-sources-new/contact-sources-new.module#ContactSourcesNewModule'
      },
    ]
  },
  {
    path: Routing.LOG_IN,
    loadChildren: './components/login/login.module#LoginModule'
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloader })],
  exports: [RouterModule],
  providers: [CustomPreloader]
})
export class AppRoutingModule { }
