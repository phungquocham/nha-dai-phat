import { Params } from '@angular/router';
import { Utils } from 'src/app/shared/helpers/utilities';

export class DailyReportModel {
  reportUserId = 0;
  goldenHours = 0;
  regularPouring = {
    uncontactable: 0,
    notPickUp: 0,
    noNeed: 0,
    hangUp: 0,
    twoSentences: 0,
    moreThanTwoSentences: 0,
  };
  selfPouring = {
    uncontactable: 0,
    notPickUp: 0,
    noNeed: 0,
    hangUp: 0,
    twoSentences: 0,
    moreThanTwoSentences: 0,
  };
  pushCount = 0;
  suggestionCount = 0;
  emailCount = 0;
  zaloFlirtingCount = 0;
  facebookFlirtingCount = 0;
  latestRatings = {};
  ratingSources = [
    {
      sourceId: 0,
      ratingItems: []
    }
  ];
}

export const filterData = {
  fromDate: '',
  toDate: '',
  sources: '',
  teams: '',
  users: '',
  page: 1,
  pageSize: 25
};

export const displayedColumns = [
  { column: 'reportDate', index: 1 },
  { column: 'createdUserName', index: 2 },
  { column: 'goldenHours', index: 3 },
  { column: 'regularPouring', index: 4 },
  { column: 'selfPouring', index: 5 },
  { column: 'pushCount', index: 6 },
  { column: 'suggestionCount', index: 7 },
  { column: 'emailCount', index: 8 },
  { column: 'zaloFlirtingCount', index: 9 },
  { column: 'facebookFlirtingCount', index: 10 },
  { column: 'latestRatings', index: 11 },
  { column: 'id', index: 99999 }
];

export function setDate(params: Params) {
  const results = {
    fromDate: new Date(),
    toDate: new Date(),
    fromDateString: '',
    toDateString: ''
  };
  const date = new Date(), y = date.getFullYear(), m = date.getMonth();
  if (params.fromDate) {
    results.fromDate = Utils.convertDateTime(params.fromDate);
  } else {
    results.fromDate = new Date(y, m, 1);
  }
  if (params.toDate) {
    results.toDate = Utils.convertDateTime(params.toDate);
  } else {
    results.toDate = new Date(y, m + 1, 0);
  }
  results.fromDateString = Utils.convertDateString(results.fromDate);
  results.toDateString = Utils.convertDateString(results.toDate);
  return results;
}

export function splitNames(name: string) {
  const item = (name || '').split(' ');
  const result = [];
  result.push(item[0]);
  result.push(item[1]);
  return result.join(' ');
}
