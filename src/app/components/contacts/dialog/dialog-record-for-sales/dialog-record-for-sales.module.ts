import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { DialogRecordForSalesComponent } from './dialog-record-for-sales.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectsService } from 'src/app/shared/services/api/projects.service';
import { ContactsService } from 'src/app/shared/services/api/contacts.service';

@NgModule({
  declarations: [DialogRecordForSalesComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  providers: [
    ProjectsService,
    ContactsService
  ],
  entryComponents: [DialogRecordForSalesComponent],
  exports: [DialogRecordForSalesComponent]

})
export class DialogRecordForSalesModule { }
