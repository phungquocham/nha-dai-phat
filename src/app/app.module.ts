import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { DialogService } from './shared/services/others/dialog.service';
import { AppSettings } from './app.settings';
import { AuthenticationService } from './shared/services/others/authentication.service';
import { AuthGuard } from './shared/guards/auth.guard';
import { environment } from 'src/environments/environment';
import { PagesComponent } from './components/pages.component';
import { ProjectRouterComponent } from './components/project-router.component';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { HttpInterceptorCustomService } from './shared/services/others/http-interceptor.service';
import { SnackbarService } from './shared/services/others/snackbar.service';
import { SnackbarModule } from './shared/components/materials/snackbar/snackbar.module';
import { DialogConfirmModule } from './shared/components/dialogs/dialog-confirm/dialog-confirm.module';
import { DialogUpdateNameModule } from './shared/components/dialogs/dialog-update-name/dialog-update-name.module';
import { DialogEditUserModule } from './components/manager/dialogs/dialog-edit-user/dialog-edit-user.module';
import { RouterHoverDirective } from './shared/directives/router-hover.directive';
import { DialogUpdateRatingModule } from './components/ratings/dialogs/dialog-update-rating/dialog-update-rating.module';
import {
  DialogReportsSelectDatetimeModule
} from './components/reports/dialogs/dialog-reports-select-datetime/dialog-reports-select-datetime.module';
import {
  DialogReportsSelectOptionsModule
} from './components/reports/dialogs/dialog-reports-select-options/dialog-reports-select-options.module';
import { DialogUserModule } from './components/daily-reports/dialogs/dialog-user/dialog-user.module';
import { DialogReportsSearchModule } from './components/daily-reports/dialogs/dialog-reports-search/dialog-reports-search.module';
// tslint:disable-next-line:max-line-length
import { DialogRatingReportsSearchModule } from './components/rating-reports/dialog-rating-reports-search/dialog-rating-reports-search.module';
import { DialogTelesalesReportsModule } from './components/telesales-reports/dialog-telesales-reports/dialog-telesales-reports.module';
import { DialogImportModule } from './components/contacts/dialog/import/import.module';
import { DialogContactsFiltersModule } from './components/contacts/dialog/dialog-contacts-filters/dialog-contacts-filters.module';
import { DialogRecordForSalesModule } from './components/contacts/dialog/dialog-record-for-sales/dialog-record-for-sales.module';
import {ContactSourceEditModule} from './components/contact-sources/dialog/edit/contact-sources-edit.module';

@NgModule({
  declarations: [
    AppComponent,
    PagesComponent,
    ProjectRouterComponent,
    NotFoundComponent,
    RouterHoverDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.FIREBASE),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    SnackbarModule,
    DialogConfirmModule,
    DialogUpdateNameModule,
    DialogEditUserModule,
    DialogUpdateRatingModule,
    DialogReportsSelectDatetimeModule,
    DialogReportsSelectOptionsModule,
    DialogUserModule,
    DialogReportsSearchModule,
    DialogRatingReportsSearchModule,
    DialogTelesalesReportsModule,
    DialogImportModule,
    DialogContactsFiltersModule,
    DialogRecordForSalesModule,
    ContactSourceEditModule
  ],
  providers: [
    AppSettings,
    DialogService,
    SnackbarService,
    AngularFireAuth,
    AuthenticationService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorCustomService,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
