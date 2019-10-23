import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageLoadingService {

  private pageLoading = new Subject<boolean[]>();
  private statusesList = [];

  // Observable string streams
  loading$ = this.pageLoading.asObservable();

  // Service message commands
  loading(status: boolean) {
    if (status === true) {
      this.statusesList.push(status);
    } else {
      this.statusesList.splice(0, 1);
    }
    this.pageLoading.next(this.statusesList);
  }
}

