import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import mergeWith from 'lodash/mergeWith';
import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import sumBy from 'lodash/sumBy';

const TYPES = {
  ONE: 1,
  THREE: 3,
};

@Component({
  selector: 'app-calc-total-pour-and-push-in-rating-sources',
  templateUrl: './calc-total-pour-and-push-in-rating-sources.component.html',
  styleUrls: ['./calc-total-pour-and-push-in-rating-sources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalcTotalPourAndPushInRatingSourcesComponent implements OnInit {
  @Input() mappingSources = {};
  @Input() mappingProjects = {};
  @Input() mappingRatings = {};
  @Input() sourceId = 0;
  @Input() ratingsInSource = {};

  @Input() rowPourIds = [];
  @Input() rowPushIds = [];
  @Input() rowHintIds = [];
  @Input() rowOtherIds = [];

  @Input() defaultComponentEmpty = false;
  @Input() showTotalWithPoints = false;
  @Input() isTeamRow = false;
  @Input() teamId = 0;
  @Input() reportUserId = 0;

  // ratingIds = [];
  mappingData = {};
  mappingPour = {};
  mappingPush = {};
  mappingHint = {};
  mappingOther = {};
  TYPES = TYPES;
  totalRatingWithPoints = 0;

  private pour = {};
  private push = {};
  private hint = {};
  private other = {};

  pourColumn = {};
  pourTooltip = {};

  pushColumn = {};
  pushTooltip = {};

  hintColumn = {};
  hintTooltip = {};

  otherColumn = {};
  otherTooltip = {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.ratingsInSource) {
      this.pour = this.ratingsInSource[1] || {};
      this.push = this.ratingsInSource[2] || {};
      this.hint = this.ratingsInSource[8] || {};
      this.other = this.ratingsInSource[4] || {};
    }

    this.mappingPour = this.cloneRating(this.pour);
    this.mappingPush = this.cloneRating(this.push);
    this.mappingHint = this.cloneRating(this.hint);
    this.mappingOther = this.cloneRating(this.other);

    this.mappingData = mergeWith(
      cloneDeep(this.mappingPour),
      cloneDeep(this.mappingPush),
      this.handleWhenMergePourAndPush
    );

    this.handleRatingColumn(
      this.rowPourIds,
      this.pourColumn,
      this.pourTooltip,
      this.mappingPour
    );

    this.handleRatingColumn(
      this.rowPushIds,
      this.pushColumn,
      this.pushTooltip,
      this.mappingPush
    );

    this.handleRatingColumn(
      this.rowHintIds,
      this.hintColumn,
      this.hintTooltip,
      this.mappingHint
    );

    this.handleRatingColumn(
      this.rowOtherIds,
      this.otherColumn,
      this.otherTooltip,
      this.mappingOther
    );

    if (this.showTotalWithPoints) {
      this.totalRatingWithPoints = 0;
      this.totalRatingWithPoints =
        this.calcColumnWithPoints(this.pourColumn) +
        this.calcColumnWithPoints(this.pushColumn) +
        this.calcColumnWithPoints(this.hintColumn) +
        this.calcColumnWithPoints(this.otherColumn);
    }
  }

  detectChanges() {
    this.cdr.detectChanges();
  }

  calcColumnWithPoints(ratingColumn) {
    let result = 0;
    Object.keys(ratingColumn).forEach((id) => {
      result += ratingColumn[id] * this.mappingRatings[id].points;
    });
    return result;
  }

  handleRatingColumn(
    rowIds = [],
    ratingColumn = {},
    ratingTooltip = {},
    ratingMapping = {}
  ) {
    rowIds.forEach((id) => {
      ratingColumn[id] = 0;
      ratingTooltip[id] = '';
    });
    Object.keys(ratingMapping).forEach((id) => {
      ratingColumn[id] = this.getValueTotal(ratingMapping[id]);
      ratingTooltip[id] = this.getTooltipInfo(ratingMapping[id]);
    });
  }

  handleWhenMergePourAndPush(pourArr: any[], pushArr: any[]) {
    if (isArray(pourArr)) {
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

  getValueTotal(array: any[]) {
    return sumBy(array, (i) => i[1]);
  }

  handleValueTotal(ratingIdWithDash, array: any[]) {
    const total = this.getValueTotal(array);
    if (this.showTotalWithPoints) {
      this.totalRatingWithPoints +=
        this.mappingRatings[ratingIdWithDash].points * total;
    }
    return total;
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
          if (this.mappingProjects[item[0]]) {
            return `${this.mappingProjects[item[0]].name}: ${item[1]}`;
          }
          return '';
        }
      })
      .join('\n');
  }

  cloneRating(obj: any) {
    const result = {};
    Object.keys(obj).forEach((id) => {
      result['_' + id] = obj[id];
    });
    return result;
  }

  private getCellData(
    mappingRatings: object,
    key: string,
    column: object,
    tooltip: object,
    isAddedPushColumn: boolean = false,
    pushColumn?: object
  ) {
    let value = '';

    if (isAddedPushColumn) {
      if (key !== '_1' && key !== '_2') {
        value = `${mappingRatings[key].name}: ${column[key]} - ${
          column[key] + pushColumn[key]
        }`;
      } else {
        value = `${mappingRatings[key].name}: ${column[key]}`;
      }
    } else {
      value = `${mappingRatings[key].name}: ${column[key]}`;
    }

    return {
      value,
      color: mappingRatings[key].color,
      tooltip: tooltip[key] ? tooltip[key] : [],
    };
  }

  getHandledRatingsData() {
    const result = [];

    if (this.showTotalWithPoints) {
      result.push({
        value: this.totalRatingWithPoints,
        color: '#FF1493',
      });
    }

    Object.keys(this.pourColumn).forEach((key) => {
      result.push(
        this.getCellData(
          this.mappingRatings,
          key,
          this.pourColumn,
          this.pourTooltip,
          true,
          this.pushColumn
        )
      );
    });

    Object.keys(this.pushColumn).forEach((key) => {
      result.push(
        this.getCellData(
          this.mappingRatings,
          key,
          this.pushColumn,
          this.pushTooltip
        )
      );
    });

    Object.keys(this.hintColumn).forEach((key) => {
      result.push(
        this.getCellData(
          this.mappingRatings,
          key,
          this.hintColumn,
          this.hintTooltip
        )
      );
    });

    Object.keys(this.otherColumn).forEach((key) => {
      result.push(
        this.getCellData(
          this.mappingRatings,
          key,
          this.otherColumn,
          this.otherTooltip
        )
      );
    });

    return {
      reportUserId: this.reportUserId,
      ratingsData: result,
      teamId: this.teamId,
    };
  }
}
