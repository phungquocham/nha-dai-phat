import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent implements OnInit {
  message: string;
  type: string;
  data: any;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) private dataFromService: SnackBarData,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.message = this.dataFromService.message || '';
    this.type = this.dataFromService.type || '';
    this.data = this.dataFromService.data || null;
    this.handleSnackBarType(this.type);
  }

  handleSnackBarType(type: string) {
    switch (type) {
      case SNACKBAR.TYPE.SUCCESS:
        this.setSnackBarCSS('#43A047');
        break;
      case SNACKBAR.TYPE.ERROR:
        this.setSnackBarCSS('#EA5E3D');
        break;
      case SNACKBAR.TYPE.INFO:
        this.setSnackBarCSS('#3f51b5');
        break;
    }
  }

  setSnackBarCSS(bgColor?: string, color?: string) {
    const ele = this.elementRef.nativeElement.parentElement || null;
    if (ele) {
      ele.style.backgroundColor = bgColor;
      ele.style.color = color;
      ele.style.maxWidth = '620px';
    }
  }
}

interface SnackBarData {
  message: string;
  type: string;
  data: any;
}

const SNACKBAR = {
  TYPE: {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    INFO: 'INFO',
  },
};
