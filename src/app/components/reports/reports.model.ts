
interface IReportRating {
  id: number;
  name: string;
  color: string;
  projectsList?: string[];
}
interface IReportResponsePrepareData {
  sourcesList: any[];
  projectsList: any[];
  ratingsList: IReportRating[];
}

export class ReportQueryParams implements IReportQueryParams {
  fromDate = '';
  toDate = '';
  projects = '';
  teams = '';
  users = '';
  sources = '';
  constructor() {}
  setData(data: IReportQueryParams) {
    Object.keys(data).forEach(key => {
      if (data[key]) {
        this[key] = data[key];
      }
    });
  }
}

export interface IReportQueryParams {
  fromDate?: string;
  toDate?: string;
  projects?: string;
  teams?: string;
  users?: string;
  sources: string;
}

interface IReportInteractionPhone {
  uncontactable?: number;
  notPickUp?: number;
  noNeed?: number;
  hangUp?: number;
  twoSentences?: number;
  moreThanTwoSentences?: number;
}

class ModelReportInteractionPhone implements IReportInteractionPhone {
  uncontactable = 0;
  notPickUp = 0;
  noNeed = 0;
  hangUp = 0;
  twoSentences = 0;
  moreThanTwoSentences = 0;
  total = 0;
  constructor() {}
}
export interface IReportResponse {
  emailCount?: number;
  goldenHours?: number;
  id?: any;
  reportUserId?: any;
  pushCount?: number;
  ratingSources?: any;
  regularPouring?: IReportInteractionPhone;
  selfPouring?: IReportInteractionPhone;
  suggestionCount?: number;
  teamId?: number;
  reportUserName?: string;
  reportUserNameTooltip?: string;
  flirtingCount?: number;
  isTeamRow?: boolean;
  totalRatingPoints?: number;
}

export class ModelReportResponseInRow implements IReportResponse {
  emailCount = 0;
  goldenHours = 0;
  id;
  pushCount = 0;
  suggestionCount = 0;
  flirtingCount = 0;
  teamId = 0;
  reportUserId;
  reportUserName = '';
  reportUserNameTooltip = '';
  ratingSources = {};
  regularPouring = new ModelReportInteractionPhone();
  selfPouring = new ModelReportInteractionPhone();
  isTeamRow = false;
  totalRatingPoints = 0;
  constructor(data?: IReportResponse) {
    if (data) {
      Object.keys(data).forEach(key => {
        this[key] = data[key];
      });
    }
  }

  generateRatingSourcesKeys(sourcesList: any[], pourList: number[], pushList: number[], othersList: number[]) {
    sourcesList.forEach(source => {
      this.ratingSources[source.id] = {
        1: {},
        2: {},
        4: {}
      };
      pourList.forEach(id => {
        this.ratingSources[source.id][1][id] = [];
      });
      pushList.forEach(id => {
        this.ratingSources[source.id][2][id] = [];
      });
      othersList.forEach(id => {
        this.ratingSources[source.id][4][id] = [];
      });
    });
  }
}

export class ModelReportRatingHandle {
  id = '';
  name = '';
  color = '';
  tooltip: any;
  total = 0;
  tooltipsList = [];
  totalRatingPoints = 0;
  constructor() { }
}
