
export class ModelQueryUrl implements IQueryUrl  {
  q = '';
  sort = '';
  direction = '';
  page = 1;
  pageSize = 25;
  status = '';
  constructor(query?: IQueryUrl) {
    if (query) {
      this.q = query.q || '';
      this.sort = query.sort || '';
      this.direction = query.direction || '';
      this.page = query.page;
      this.pageSize = query.pageSize;
      this.status = query.status || '';
    }
   }

  setDefault() {
    this.q = '';
    this.sort = '';
    this.direction = '';
    this.page = 1;
    this.pageSize = 25;
    this.status = '';
  }
}

export interface IQueryUrl {
  q?: string;
  sort?: string;
  direction?: string;
  page?: number;
  pageSize?: number;
  status?: string;
}
