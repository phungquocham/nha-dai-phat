import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';
// import { DialogAdapterData } from '../../helpers/dialog-adapter.namespace';

@Injectable()
export class DialogService {
  constructor(private dialog: MatDialog) {}

  config(iConfig: IDialogConfig): any {
    return iConfig;
  }

  open(dialog: IDialog): Observable<any> {
    let dialogRef: MatDialogRef<any>;
    dialogRef = this.dialog.open(dialog.component, dialog.config);
    dialogRef.componentInstance.data = dialog.data;
    return dialogRef.afterClosed();
  }

  // closeDialog(data = null) {
  //   // DialogAdapterData.setData(null);
  //   if (this.dialogRef) {
  //     this.dialogRef.afterClosed().subscribe(() => {
  //       this.dialogRef = null;
  //     });
  //     this.dialogRef.close(data);
  //   }
  // }

  configDefault() {
    return {
      width: '700px',
      height: 'calc(100% - 50px)',
      position: {
        bottom: '2px',
        right: '2px',
      },
    };
  }

  configFull(config?: IDialogConfig) {
    // if (Utils.isMobile()) {
    //   return {};
    // }
    return {
      // autoFocus: (config && config.autoFocus === false) ? config.autoFocus : true,
      autoFocus: false,
      width: config && config.width ? `${config.width}` : '700px',
      minWidth: '295px',
      // minWidth: '335px',
      height: 'calc(100% - 26px)',
      panelClass: 'dialog-no-padding',
      position: {
        top: '13px',
        bottom: '13px',
        right: '13px',
      },
    };
  }
}

export interface IDialog {
  component?: any;
  config?: any;
  data?: any;
}

interface IDialogConfig {
  autoFocus?: boolean;
  disableClose?: boolean;
  width?: string;
  minWidth?: string;
  height?: string;
  minHeight?: string;
  panelClass?: string;
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}
