import { isNumber, isDate } from 'util';
import * as moment from 'moment-timezone';

export class UtilsDateTime {
  static getDatetimeInVN(data: any, format?: string) {
    if (!format) {
      format = 'DD/MM/YYYY';
    }
    if (isNumber(data)) { // timestamp
      if (data === 0) {
        return '';
      }
      // return new Date(data * 1000).toLocaleDateString('vi-VN');
      return moment(data * 1000).tz('Asia/Ho_Chi_Minh').format(format);
    }
    if (isDate(data)) {
      // return new Date(data).toLocaleDateString('vi-VN');
      return moment(data).tz('Asia/Ho_Chi_Minh').format(format);
    }
  }
  static getTodayInVN(format?: string) {
    if (!format) {
      format = 'DD/MM/YYYY';
    }
    // return  new Date().toLocaleDateString('vi-VN');
    return moment().tz('Asia/Ho_Chi_Minh').format(format);
  }
  static convertDateStringDDMMYYYY(date: any, character = '/'): string {
    const d = new Date(date);
    return [this.add_2digit(d.getDate()), this.add_2digit((d.getMonth() + 1)), d.getFullYear()].join(character);
  }

  static convertDateTimeDDMMYYYY(date: string, character = '/'): Date {
    const d = date.split(character);
    if (d.length === 3) {
      const year = Number(d[2]), month = Number(d[1]), day = Number(d[0]);
      return new Date(year, month - 1, day);
    }
    return new Date();
  }

  static add_2digit(n: any) {
    return ('00' + (n + '')).slice(-2);
  }

}
