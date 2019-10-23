import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateCustomConvert'
})
export class DateCustomConvertPipe implements PipeTransform {

  constructor(
  ) { }

  private getDateString(dateStr: string) {
    if (dateStr) {
      const date = new Date(new Date(dateStr)); // .getTime()
      const temp = date.toString().split(' ');
      return `${temp[1]} ${temp[2]}, ${temp[3]}`;
    }
    return '';
  }

  private getTimeFromMinutes(value: number) {
    let hh = Math.floor(value / 60);
    const mm = value % 60;
    if (hh < 12) {
      if (hh === 0) {
        hh = 12;
      }
      return `${(hh < 10) ? ('0' + hh) : hh}:${(mm < 10) ? ('0' + mm) : mm} AM`;
    }
    if (hh > 12) {
      hh -= 12;
    }
    return `${(hh < 10) ? ('0' + hh) : hh}:${(mm < 10) ? ('0' + mm) : mm} PM`;
  }

  transform(time: any, format = '', fullTime = false): string {
    const date = new Date(time * 1000);
    let result;
    switch (format) {
      case 'MM-DD,YYYY':
        result = this.getDateString(date.toString());
        break;
      default:
        const year = date.getFullYear(),
          month = ('0' + (date.getMonth() + 1)).substr(-2),
          day = ('0' + date.getDate()).substr(-2);
        // result = `${year}-${month}-${day}`;
        result = `${day}/${month}/${year}`;
    }
    if (fullTime) {
      result += ` - ${this.getTimeFromMinutes(date.getHours() * 60 + date.getMinutes())}`;
    }
    return result;
  }

}
