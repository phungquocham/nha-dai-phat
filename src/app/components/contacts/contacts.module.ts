import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from './contacts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ContactsFiltersModule } from './contacts-filters/contacts-filters.module';
import { ContactSourceService } from 'src/app/shared/services/api/contact-sources.service';
import { UsersService } from 'src/app/shared/services/api/users.service';
import { ContactResultsService } from 'src/app/shared/services/api/contact-results.service';
import { TeamsService } from 'src/app/shared/services/api/teams.service';
import { DialogContactsFiltersModule } from './dialog/dialog-contacts-filters/dialog-contacts-filters.module';

export const routes: Routes = [
  {
    path: '', component: ContactsComponent, pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ContactsFiltersModule,
    DialogContactsFiltersModule
  ],
  providers: [
    ContactSourceService,
    UsersService,
    ContactResultsService,
    TeamsService,
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  declarations: [
    ContactsComponent
  ]
})
export class ContactsModule { }
