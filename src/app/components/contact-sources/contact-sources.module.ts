import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactSourcesComponent } from './contact-sources.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

export const routes: Routes = [
  {
    path: '', component: ContactSourcesComponent, pathMatch: 'full'
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
  ],
  declarations: [
    ContactSourcesComponent
  ]
})
export class ContactSourcesModule { }
