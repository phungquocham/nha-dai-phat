import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogUpdateRatingComponent } from './dialog-update-rating.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [DialogUpdateRatingComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule
  ],
  entryComponents: [DialogUpdateRatingComponent],
  exports: [DialogUpdateRatingComponent]
})
export class DialogUpdateRatingModule { }
