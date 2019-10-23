import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { RatingsService } from 'src/app/shared/services/api/ratings.service';
import {
  Subject
} from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();
  ratingsList: any[] = [];
  constructor(
    private ratingsService: RatingsService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.getRatingsList();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private detechChanges() {
    this.cdr.detectChanges();
  }

  // getReportsList(): Observable<any> {
  //   return this.reportsService.aggregateReports({
  //     query: {
  //       fromDate: '01/06/2019',
  //       toDate: '01/06/2019',
  //     }
  //   });
  // }

  private getRatingsList() {
    this.ratingsService.aggregateRatings().subscribe((res: any[]) => {
      this.ratingsList = res;
      this.detechChanges();
    });
  }

}
