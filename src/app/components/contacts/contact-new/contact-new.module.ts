import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactNewComponent } from './contact-new.component';
import { ContactsService } from 'src/app/shared/services/api/contacts.service';

export const routes = [
  { path: '', component: ContactNewComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    ContactsService
  ],
  entryComponents: [ContactNewComponent],
  declarations: [ContactNewComponent],
  exports: [ContactNewComponent]
})
export class ContactNewModule { }
