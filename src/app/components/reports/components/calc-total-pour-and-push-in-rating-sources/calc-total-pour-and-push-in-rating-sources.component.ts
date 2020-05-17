import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-calc-total-pour-and-push-in-rating-sources',
  templateUrl: './calc-total-pour-and-push-in-rating-sources.component.html',
  styleUrls: ['./calc-total-pour-and-push-in-rating-sources.component.scss'],
})
export class CalcTotalPourAndPushInRatingSourcesComponent implements OnInit {
  @Input() ratingSources = {};
  @Input() id = '';

  constructor() {}

  ngOnInit() {
    console.log('AAAAAAAAAAAAAAA', this.ratingSources);
    // console.log('AAAAAAA', this.ratingSources);
  }
}
