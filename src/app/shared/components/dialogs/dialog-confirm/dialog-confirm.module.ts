import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { DialogConfirmComponent } from './dialog-confirm.component';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  declarations: [DialogConfirmComponent],
  entryComponents: [DialogConfirmComponent],
  exports: [DialogConfirmComponent],
})
export class DialogConfirmModule {}
