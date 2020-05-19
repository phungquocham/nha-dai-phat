import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

const TYPES = {
  ONE: 1,
  THREE: 3,
};

@Component({
  selector: 'app-calc-total-pour-and-push-in-rating-sources',
  templateUrl: './calc-total-pour-and-push-in-rating-sources.component.html',
  styleUrls: ['./calc-total-pour-and-push-in-rating-sources.component.scss'],
})
export class CalcTotalPourAndPushInRatingSourcesComponent implements OnInit {
  @Input() pour = {}; // 8 types
  @Input() push = {};
  @Input() mappingSources = {};
  @Input() mappingProjects = {};
  @Input() mappingRatings = {};
  @Input() sourceId = 0;

  ratingIdsWithTypeThree = [];
  mappingData = {};
  mappingPour = {};
  TYPES = TYPES;

  constructor() {}

  ngOnInit() {
    this.mappingPour = _.cloneDeep(this.pour);
    this.mappingData = _.mergeWith(
      this.pour,
      this.push,
      this.handleWhenMergePourAndPush
    );
    this.ratingIdsWithTypeThree = [];
    if (this.mappingPour) {
      Object.keys(this.mappingPour).forEach((ratingIdWithDash) => {
        if (
          this.mappingRatings[this.removeDashFromId(ratingIdWithDash)].types ===
            1 ||
          this.mappingRatings[this.removeDashFromId(ratingIdWithDash)].types ===
            3
        ) {
          this.ratingIdsWithTypeThree.push(ratingIdWithDash);
        }
      });
    }
    this.ratingIdsWithTypeThree = _.uniq(this.ratingIdsWithTypeThree);
  }

  handleWhenMergePourAndPush(pourArr: any[], pushArr: any[]) {
    if (_.isArray(pourArr)) {
      pushArr.forEach((pushItem) => {
        const index = pourArr.findIndex(
          (pourItem) => pourItem[0] === pushItem[0]
        );
        if (index < 0) {
          pourArr.push(pushItem);
        } else {
          pourArr[index][1] += pushItem[1];
        }
      });
      return pourArr;
    }
  }

  getRatingIds(ratingObj) {
    return Object.keys(ratingObj);
  }

  removeDashFromId(id: string) {
    return +id.replace('_', '');
  }

  getValueTotal(array: any[]) {
    return _.sumBy(array, (i) => i[1]);
  }

  getTooltipInfo(data: any[]) {
    if (!data || data.length === 0) {
      return;
    }
    return data
      .map((item) => {
        if (item[0] === 0) {
          return `${item[1]}`;
        } else {
          return `${this.mappingProjects[item[0]].name}: ${item[1]}`;
        }
      })
      .join('\n');
  }

  getBackgroundColor(ratingIdWithDash: string) {
    return (
      this.mappingRatings[this.removeDashFromId(ratingIdWithDash)].color ||
      'unset'
    );
  }

  getRatingName(ratingIdWithDash: string) {
    return (
      this.mappingRatings[this.removeDashFromId(ratingIdWithDash)].name ||
      'unknow'
    );
  }

  isRatingTypeThree(id: number) {
    return this.mappingRatings[id].types === 3;
  }
}
