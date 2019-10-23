import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogImportComponent } from './import.component';
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
  entryComponents: [DialogImportComponent],
  declarations: [DialogImportComponent],
  exports: [DialogImportComponent]
})
export class DialogImportModule { }
