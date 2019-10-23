import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactSourcesDetailComponent } from './contact-sources-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContactSourceService } from 'src/app/shared/services/api/contact-sources.service';

export const routes: Routes = [
  {
    path: '', component: ContactSourcesDetailComponent, pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ContactSourceService
  ],
  declarations: [
    ContactSourcesDetailComponent
  ]
})
export class ContactSourcesDetailModule { }
