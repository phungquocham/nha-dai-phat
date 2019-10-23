import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactSourcesFieldsComponent } from './contact-sources-fields.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [

  ],
  entryComponents: [ContactSourcesFieldsComponent],
  declarations: [ContactSourcesFieldsComponent],
  exports: [ContactSourcesFieldsComponent]
})
export class ContactSourcesFieldsModule { }
