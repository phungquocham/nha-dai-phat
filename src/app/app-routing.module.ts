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
        loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { preload: true }
      },
      {
        path: Routing.MANAGER,
        loadChildren: () => import('./components/manager/manager.module').then(m => m.ManagerModule),
      },
      {
        path: Routing.DAILYREPORTS,
        loadChildren: () => import('./components/daily-reports/daily-reports.module').then(m => m.DailyReportsModule),
      },
      {
        path: Routing.REPORTS,
        loadChildren: () => import('./components/reports/reports.module').then(m => m.ReportsModule),
      },
      {
        path: Routing.DAILYREPORTS,
        loadChildren: () => import('./components/daily-reports/daily-reports.module').then(m => m.DailyReportsModule)
      },
      {
        path: Routing.DAILYREPORTS + '/new',
        loadChildren: () => import('./components/daily-reports/daily-report-new/daily-report-new.module').then(m => m.DailyReportNewModule)
      },
      {
        path: Routing.DAILYREPORTS + '/:id',
        loadChildren: () => import('./components/daily-reports/daily-report-new/daily-report-new.module').then(m => m.DailyReportNewModule)
      },
      {
        path: Routing.RATING_REPORTS,
        loadChildren: () => import('./components/rating-reports/rating-reports.module').then(m => m.RatingReportsModule)
      },
      {
        path: Routing.CONTACTS,
        loadChildren: () => import('./components/contacts/contacts.module').then(m => m.ContactsModule)
      },
      {
        path: `${Routing.CONTACTS}/${Routing.NEW}`,
        loadChildren: () => import('./components/contacts/contact-new/contact-new.module').then(m => m.ContactNewModule)
      },
      {
        path: `${Routing.CONTACTS}/:id`,
        loadChildren: () => import('./components/contacts/contact-new/contact-new.module').then(m => m.ContactNewModule)
      },
      {
        path: Routing.TELESALES_REPORTS,
        loadChildren: () => import('./components/telesales-reports/telesales-reports.module').then(m => m.TelesalesReportsModule)
      },
      {
        path: Routing.CONTACT_SOURCES,
        loadChildren: () => import('./components/contact-sources/contact-sources.module').then(m => m.ContactSourcesModule)
      },
      {
        path: Routing.CONTACT_SOURCES + '/:id',
        loadChildren: () => import('./components/contact-sources-detail/contact-sources-detail.module').then(m => m.ContactSourcesDetailModule)
      },
      {
        path: `${Routing.CONTACT_SOURCES}/:id/assignments`,
        loadChildren: () => import('./components/contact-sources-new/contact-sources-new.module').then(m => m.ContactSourcesNewModule)
      },
      {
        path: `${Routing.CONTACT_SOURCES}/:id/assignments/:assignedDate`,
        loadChildren: () => import('./components/contact-sources-new/contact-sources-new.module').then(m => m.ContactSourcesNewModule)
      },
    ]
  },
  {
    path: Routing.LOG_IN,
    loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloader, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [CustomPreloader]
})
export class AppRoutingModule { }
