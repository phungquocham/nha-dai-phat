import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogReportsSelectDatetimeComponent } from './dialog-reports-select-datetime.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DialogReportsSelectDatetimeComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  entryComponents: [DialogReportsSelectDatetimeComponent],
  exports: [DialogReportsSelectDatetimeComponent]
})
export class DialogReportsSelectDatetimeModule { }
