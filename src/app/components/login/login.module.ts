import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login.component';
import { LoginResolver } from './login-resolver.service';
import { SnackbarService } from '../../shared/services/others/snackbar.service';
import { WindowService } from '../../shared/services/others/window.service';

export const routes: Routes = [
  {
    path: '',
    resolve: {
      isLogedIn: LoginResolver
    },
    component: LoginComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    LoginResolver,
    SnackbarService,
    WindowService
  ]
})
export class LoginModule { }
