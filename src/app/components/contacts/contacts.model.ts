import { Params } from '@angular/router';
import { Utils } from 'src/app/shared/helpers/utilities';

export class DailyReportModel {

}

export const filterData = {
  q: '',
  page: 1,
  pageSize: 25,
  contactSourceIds: '',
  fromAssignedDate: '',
  toAssignedDate: '',
  assignedTeamIds: '',
  assignedUserIds: '',
  contactResultIds: '',
  minMatches: ''
};

export const displayedColumns = [
  { column: 'code', index: 0 },
  { column: 'name', index: 1 },
  { column: 'phones', index: 2 },
  { column: 'emails', index: 3 },
  { column: 'addresses', index: 4 },
  { column: 'suppliedSource', index: 5 },
  { column: 'assignments', index: 6 },
  { column: 'id', index: 99999 }
];

export const ratings = {
  1: 'KLL',
  2: 'KBM',
  3: 'KNC',
  4: 'CM',
  5: 'CHUI',
  6: 'F0-',
  7: 'F0',
  8: 'F1',
  9: 'F1A'
};
