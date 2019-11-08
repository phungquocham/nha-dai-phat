import { HttpHeaders } from '@angular/common/http';

export const BUTTON = {
  OK: 'ok',
  CANCEL: 'cancel'
};

export const USER_STATUSES = {
  ACTIVE: 1,
  LOCKED: 2
};

export const ROLE = {
  ADMINISTRATOR: 'Administrator',
  MANAGER: 'Manager',
  SALES: 'Sales',
  GUEST: 'Guest'
};

export const TAB_ELEMENT = {
  KEY: {
    DISPLAY: 'display',
  },
  NAME: {
    SOURCES: 'sources',
    TEAMS: 'teams',
    USERS: 'users'
  }
};

export const HTTP_HEADER = {
  CONTENT_TYPE: {
      APPLICATION_JSON_PATH_JSON: new HttpHeaders().set('Content-Type', 'application/json-patch+json'),
      APPLICATION_TEXT: new HttpHeaders().set('Content-Type', 'application/json'),
      APPLICATION_ALLOW: new HttpHeaders().set(
        'Content-Type',
        `Access-Control-Allow-Headers,
        Origin,Accept,
        X-Requested-With,
        Content-Type,
        Access-Control-Request-Method,
        Access-Control-Request-Headers`
      ),
      APPLICATION_JSON: new HttpHeaders().set('Content-Type', 'application/json'),
  }
};

export const TYPE_COMPONENT = {
  SOURCES: 'SOURCES',
  CONTACT_RESULTS: 'CONTACT_RESULTS'
};

export const TYPE_BASIC = {
  NEW: 'NEW'
};

export const CONFIRM = {
  OK: 'OK',
  CANCEL: 'CANCEL'
};

export const TypesF = {
  F0_MINUS: {
    name: 'F0-',
    tooltip: 'Kết nối với KH'
  },
  F0: {
    name: 'F0',
    tooltip: 'KH quan tâm thị trường BĐS'
  },
  F1: {
    name: 'F1',
    tooltip: 'quan tâm'
  },
  F1A: {
    name: 'F1A',
    tooltip: 'hẹn gặp KH'
  },
  F2: {
    name: 'F2',
    tooltip: 'KH gặp được'
  },
  F2_PLUS: {
    name: 'F2+',
    tooltip: 'gặp chung'
  },
  F2_MULTIPLY: {
    name: 'F2*',
    tooltip: 'KH cũ gặp lại'
  },
  F3A: {
    name: 'F3A',
    tooltip: 'KH follow'
  },
  F3A_PLUS: {
    name: 'F3A+',
    tooltip: 'KH follow chung'
  },
  F4: {
    name: 'F4',
    tooltip: 'bán'
  },
  F4_PLUS: {
    name: 'F4+',
    tooltip: 'bán chung'
  },
};

