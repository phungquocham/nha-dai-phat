import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_FORMATS,
} from '@angular/material-moment-adapter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogEditUserComponent } from './dialog-edit-user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TeamsService } from 'src/app/shared/services/api/teams.service';

@NgModule({
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule],
  providers: [
    TeamsService,
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  entryComponents: [DialogEditUserComponent],
  declarations: [DialogEditUserComponent],
  exports: [DialogEditUserComponent],
})
export class DialogEditUserModule {}
