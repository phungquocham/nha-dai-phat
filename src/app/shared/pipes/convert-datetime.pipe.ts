import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../helpers/utilities';

@Pipe({
  name: 'convertDatetime'
})
export class ConvertDatetimePipe implements PipeTransform {
  transform(timestamp: number): string {
    const result = Utils.DateTime.getDatetimeInVN(timestamp);
    if (result) {
      return result;
    }
    return 'N/A';
  }
}
