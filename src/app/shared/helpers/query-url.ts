import { Params } from '@angular/router';
import { Utils } from './utilities';


export class QueryEvents {

  static setQuery(filter: any, params: Params) {

    Object.keys(filter).forEach((key: string) => {

      if (typeof filter[key] === 'number') {

        filter[key] = Utils.CheckNumber(params[key]) ? Number(params[key]) : filter[key];

      } else if (typeof filter[key] === 'string') {

        filter[key] = params[key] ? params[key] : filter[key];

      }

    });

    return filter;
  }

}
