import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSelectAutocompleteComponent } from './custom-select-autocomplete.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomSelectAutocompleteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [CustomSelectAutocompleteComponent]
})
export class CustomSelectAutocompleteModule { }
