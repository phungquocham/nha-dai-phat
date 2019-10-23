import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { AuthenticationService } from '../../shared/services/others/authentication.service';

@Injectable()
export class LoginResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.authService.authenticated$.pipe(
      take(1),
      tap(authenticated => {
        if (authenticated) {
          this.router.navigate(['/']);
        }
      })
    );
  }
}
