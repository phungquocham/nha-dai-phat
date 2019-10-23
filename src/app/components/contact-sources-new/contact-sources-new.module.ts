import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactSourcesNewComponent } from './contact-sources-new.component';
import { ContactSourcesFieldsModule } from './contact-sources-fields/contact-sources-fields.module';
import { CustomSelectAutocompleteModule } from '../../shared/components/materials/custom-select-autocomplete/custom-select-autocomplete.module';

export const routes = [
  { path: '', component: ContactSourcesNewComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ContactSourcesFieldsModule,
    CustomSelectAutocompleteModule
  ],
  providers: [

  ],
  entryComponents: [ContactSourcesNewComponent],
  declarations: [ContactSourcesNewComponent],
  exports: [ContactSourcesNewComponent]
})
export class ContactSourcesNewModule { }
