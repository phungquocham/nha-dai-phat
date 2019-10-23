import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserProfile } from 'src/app/shared/models/user.profile.namespace';
import { ROLE } from 'src/app/shared/helpers/const';
import { Routing } from 'src/app/shared/helpers/routing';

@Injectable()
export class DashboardResolver implements Resolve<any> {
  constructor(
    private router: Router
  ) { }

  resolve(): Observable<any> {
    if (UserProfile.getRole() === ROLE.SALES) {
      this.router.navigate([Routing.DAILYREPORTS]);
    } else {
      return of(true);
    }
  }
}
