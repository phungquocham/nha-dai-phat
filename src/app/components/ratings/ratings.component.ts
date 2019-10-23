import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RatingsService } from 'src/app/shared/services/api/ratings.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/app/shared/services/others/dialog.service';
import { DialogUpdateRatingComponent } from './dialogs/dialog-update-rating/dialog-update-rating.component';
import { CONFIRM } from 'src/app/shared/helpers/const';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  ratingsList = [];
  colorPanelPosition = 'left';

  constructor(
    private ratingsService: RatingsService,
    private cdr: ChangeDetectorRef,
    private dialog: DialogService
  ) { }

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

  getRatingsList() {
    this.ratingsService.getRatingsList().pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      console.log(res);
      this.ratingsList = res;
      this.detechChanges();
    });
  }

  updateRatingsList() {
    console.log(this.ratingsList);
  }

  openDialogUpdateRating(data: any) {
    this.dialog.open({
      component: DialogUpdateRatingComponent,
      data: data
    }).subscribe(res => {
      if (res && res.status === CONFIRM.OK) {
        this.ratingsService.updateRating(data.id, res.data).subscribe(_ => {
          this.getRatingsList();
        });
      }
    });
  }
}
