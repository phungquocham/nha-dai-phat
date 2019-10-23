import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputBasicComponent } from './input-basic.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [InputBasicComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    InputBasicComponent
  ]
})
export class InputBasicModule { }
