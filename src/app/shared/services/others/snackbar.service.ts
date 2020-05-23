import { Injectable } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../components/materials/snackbar/snackbar.component';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  open(snackbar: ISnackbar) {
    // this.translate.get(snackbar.message).subscribe(msg => {
    const config = snackbar.customConfig || new MatSnackBarConfig();
    config.data = {
      message: snackbar.message,
      type: snackbar.type,
      data: snackbar.data,
    };
    config.horizontalPosition = 'right';
    config.duration = 3000 || snackbar.customConfig.duration;
    this.snackbar.openFromComponent(SnackbarComponent, config);
    // });
  }
}

export interface ISnackbar {
  message: string;
  type: string;
  data?: any;
  customConfig?: MatSnackBarConfig;
}
