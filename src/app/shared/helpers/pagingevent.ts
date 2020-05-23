import { PageEvent } from '@angular/material/paginator';

export class PagingEvents {
  static sort = {
    sort: '',
    direction: '',
  };
  init(event?: PageEvent, router = null, pageSize?) {
    if (router !== null) {
      return this.page(event);
    } else {
      return this.checkPage(event, pageSize);
    }
  }
  private page(event?: PageEvent) {
    return {
      page: event.pageIndex + 1,
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    };
  }
  private checkPage(event?: PageEvent, pageSize?) {
    if (Number(pageSize) !== Number(event.pageSize)) {
      return {
        page: 1,
        pageIndex: 0,
        pageSize: event.pageSize,
      };
    } else {
      return this.page(event);
    }
  }
}
