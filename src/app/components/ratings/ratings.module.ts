import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
  import { ColorPickerModule } from 'ngx-color-picker';


import { RatingsComponent } from './ratings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RatingsService } from 'src/app/shared/services/api/ratings.service';

export const routes = [
  {
    path: '',
    component: RatingsComponent
  }
];

@NgModule({
  declarations: [RatingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ColorPickerModule
  ],
  providers: [
    RatingsService
  ]
})
export class RatingsModule { }
