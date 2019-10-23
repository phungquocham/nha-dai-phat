import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogUpdateNameComponent } from './dialog-update-name.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DialogUpdateNameComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [DialogUpdateNameComponent],
  exports: [DialogUpdateNameComponent]
})
export class DialogUpdateNameModule { }
