import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatButtonModule } from '@angular/material';

import { DialogConfirmComponent } from './dialog-confirm.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  declarations: [DialogConfirmComponent],
  entryComponents: [DialogConfirmComponent],
  exports: [DialogConfirmComponent]
})
export class DialogConfirmModule { }
