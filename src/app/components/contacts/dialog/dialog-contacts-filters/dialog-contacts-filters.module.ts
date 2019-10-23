import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';




import { DialogContactsFiltersComponent } from './dialog-contacts-filters.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContactsFiltersModule } from '../../contacts-filters/contacts-filters.module';

@NgModule({
  declarations: [DialogContactsFiltersComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ContactsFiltersModule
  ],
  entryComponents: [DialogContactsFiltersComponent],
  exports: [DialogContactsFiltersComponent]
})
export class DialogContactsFiltersModule { }
