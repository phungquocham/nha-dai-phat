import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_FORMATS,
} from '@angular/material-moment-adapter';

import { ContactsFiltersComponent } from './contacts-filters.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomSelectAutocompleteModule } from 'src/app/shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.module';

@NgModule({
  declarations: [ContactsFiltersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CustomSelectAutocompleteModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  exports: [ContactsFiltersComponent],
})
export class ContactsFiltersModule {}
