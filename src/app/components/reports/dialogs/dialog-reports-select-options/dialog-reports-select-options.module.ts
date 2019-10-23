import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogReportsSelectOptionsComponent } from './dialog-reports-select-options.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  CustomSelectAutocompleteModule
} from 'src/app/shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.module';

@NgModule({
  declarations: [DialogReportsSelectOptionsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CustomSelectAutocompleteModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  entryComponents: [DialogReportsSelectOptionsComponent],
  exports: [DialogReportsSelectOptionsComponent]
})
export class DialogReportsSelectOptionsModule { }
