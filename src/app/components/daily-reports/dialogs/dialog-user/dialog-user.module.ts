import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogUserComponent } from './dialog-user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DailyReportService } from 'src/app/shared/services/api/daily-reports.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    DailyReportService
  ],
  entryComponents: [DialogUserComponent],
  declarations: [DialogUserComponent],
  exports: [DialogUserComponent]
})
export class DialogUserModule { }
