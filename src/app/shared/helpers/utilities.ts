import { environment } from 'src/environments/environment';
import { UtilsDateTime } from './utils/utils_datetime';
import { ModelQueryUrl } from '../models/url-query.model';
import { isBoolean } from 'util';
import * as moment from 'moment-timezone';


interface IEncodeQueryUrl {
  query: ModelQueryUrl | any;
  exceptKeys?: string[];
  exceptStrings?: string[];
  existedQuery?: string;
  allowReturnBoolean?: boolean;
  usingEncodeUri?: boolean;
}

export class Utils {

  static DateTime = UtilsDateTime;

  static groupItemsInArray(xs: any[], key: string) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  static joinArray(array: any[], character: string): string {
    return array.join(character);
  }

  static randomNumber(from?: number, to?: number) {
    if (from > 0 || to > 0) {
      return Math.floor(from + Math.random() * to);
    }
    return Math.floor(1000000000 + Math.random() * 900000000000);
  }

  static getProjectApi(url: string) {
    return `${environment.API_DOMAIN}/${url}`;
  }

  static StringReplaceAt(string: string, index: number, replace: string) {
    return string.substring(0, index) + replace + string.substring(index + 1);
  }

  static ConvertPhoneNumberToZero(value: string) {
    if (value.includes('+')) {
      return '0' + value.slice(3, value.length);
    }
    return value;
  }

  static ConvertPhoneNumberWithVietNamePhoneCode(phone: string) {
    return this.StringReplaceAt(phone, 0, '+84');
  }

  static CheckNumber(number: any) {
    if (String(Number(number)) === 'NaN' || number === '' || number === null) {
      return false;
    }
    return true;
  }

  static removeComma(n: any) {
    return (n + '').replace(/,+/g, '');
  }

  static convertNumber(n: any) {
    return Number(this.removeComma(n));
  }

  static convertDateString(date: any): string {
    const d = new Date(date);
    return `${this.add_2digit(d.getDate())}/${this.add_2digit((d.getMonth() + 1))}/${d.getFullYear()}`;
  }

  static convertDateTime(date: string): Date {
    const d = date.split('/');
    if (d.length === 3) {
      const year = Number(d[2]), month = Number(d[1]), day = Number(d[0]);
      return new Date(year, month - 1, day);
    }
    return new Date();
  }

  static CalculatePercent(x: number, y: number): string {
    if (y === 0) {
      return '0.00%';
    }
    return (x / y * 100).toFixed(2) + '%';
  }

  static add_2digit(n: any) {
    return ('00' + (n + '')).slice(-2);
  }

  static encodeQueryData(data: any) {
    const ret = [];
    for (const d in data) {
      if (data[d]) {
        if (d === 'page' || d === 'pageSize') {
          if (Utils.convertNumber(data[d]) === 1 || Utils.convertNumber(data[d]) === 25) {
            // skip continue
          } else {
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
          }
        } else {
          ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        }
      }
    }
    if (ret.length > 0) {
      return `?${ret.join('&')}`;
    }
    return ret.join('&');
  }

  static transform(timeData: any) {
    const time = timeData * 1000;
    return moment(time).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
  }

  static getTimestamp(): number {
    return Math.round(new Date().getTime() / 1000);
  }

  static sortIndex(data: any) {
    data = data.sort(function (a, b) {
      return a.index - b.index;
    });
    return data;
  }
  static sortDESC(data: any) {
    data = data.sort(function (a, b) {
      return b[0] -  a[0];
    });
    return data;
  }
  static encodeQueryUrl(config: IEncodeQueryUrl, returnObject = false): any {
    const result = [];
    if (config.query.pageSize && config.query.pageSize > 100) {
      config.query.pageSize = 100;
    }
    for (const key of Object.keys(config.query)) {
      if (config.query[key]) {
        let str = '';
        if (config.usingEncodeUri) {
          str = encodeURIComponent(key) + '=' + encodeURIComponent(config.query[key]);
        } else {
          str = key + '=' + config.query[key];
        }
        if (config.exceptStrings && config.exceptStrings.length > 0) {
          if (config.exceptStrings.find(item => item.localeCompare(str) === 0)) {
            str = '';
          }
        }
        if (str) {
          result.push(str);
        }
      }
      if (config.allowReturnBoolean && isBoolean(config.query[key])) {
        let str = '';
        if (config.usingEncodeUri) {
          str = encodeURIComponent(key) + '=' + encodeURIComponent(config.query[key]);
        } else {
          str = key + '=' + config.query[key];

        }
        if (config.exceptStrings && config.exceptStrings.length > 0) {
          if (config.exceptStrings.find(item => item.localeCompare(str) === 0)) {
            str = '';
          }
        }
        if (str && !config.query[key]) {
          result.push(str);
        }
      }
    }
    if (config.exceptKeys && config.exceptKeys.length > 0) {
      config.exceptKeys.forEach(key => {
        const index = result.findIndex(item => item.includes(key));
        if (index > -1) {
          result.splice(index, 1);
        }
      });
    }
    if (config.existedQuery && config.existedQuery.length > 0 && !returnObject) {
      if (config.existedQuery.includes('?')) {
        return `${config.existedQuery}${result.length > 0 ? `&${result.join('&')}` : ''}`;
      } else {
        return `${config.existedQuery}${result.length > 0 ? `?${result.join('&')}` : ''}`;
      }
    }
    if (returnObject === true) {
      const newObj = {};
      if (config.existedQuery && config.existedQuery.length > 0) {
        const tempExistedQuery = config.existedQuery.replace('?', '').split('&');
        tempExistedQuery.forEach((item: string) => {
          const temp = item.split('=');
          newObj[temp[0]] = temp[1];
        });
      }
      result.forEach((item: string) => {
        const temp = item.split('=');
        newObj[temp[0]] = temp[1];
      });
      return newObj;
    }
    return (result.length > 0) ? `?${result.join('&')}` : '';
  }

  static groupValues(arr: any[], key: string) {
    const mapped = {};
    arr.forEach(el => {
      const actualKey = el[key];
      if (!mapped.hasOwnProperty(actualKey)) {
        mapped[actualKey] = [];
      }
      mapped[actualKey].push(el);
    });
    return Object.keys(mapped).map(el => mapped[el]);
  }
}
