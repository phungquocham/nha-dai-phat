import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  ActivatedRoute
} from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


import { Observable, of, from, Subject } from 'rxjs';
import { take, tap, map, switchMap, catchError, finalize } from 'rxjs/operators';

import { AuthenticationService } from '../services/others/authentication.service';
import { Routing } from '../helpers/routing';
import { Location } from '@angular/common';
import { UsersService } from '../services/api/users.service';
import { UserProfile } from '../models/user.profile.namespace';
import { ROLE } from '../helpers/const';


@Injectable()

export class AuthGuard implements CanActivate, CanActivateChild {

  private isAllowedGetProfile = false;
  private ngUnsubscribe = new Subject<any>();

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private usersService: UsersService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log('can activate');
    return this.authService.authenticated$.pipe(
      take(1),
      tap(authenticated => {
        console.log(authenticated);
        if (!authenticated) {
          this.router.navigate([Routing.LOG_IN]);
          this.isAllowedGetProfile = false;
        } else {
          this.isAllowedGetProfile = true;
          // console.log(Projects.getProjectId());
          // if (!Projects.getProjectSlug()) {
          //   const urlSplits = this.location.path().split('/');
          //   if (urlSplits[1] === Routing.PROJECTS && urlSplits[2]) {
          //     Projects.setProjectSlug(urlSplits[2]);
          //     console.log('somethings ???');
          //   } else {
          //     const items = state.url.split('/');
          //     console.log(items);
          //     if (items[1] === Routing.PROJECTS) {
          //       if (items[2]) {
          //         const projectId = items[2];
          //         Projects.setProjectSlug(projectId);
          //         this.router.navigate([state.url]);
          //       }
          //     }
          //   }
          // }
        }
      }),
      switchMap(_ => { // get profile
        if (this.isAllowedGetProfile) {
          return this.getProfile();
        }
        return of(false);
      }),
      catchError(error => {
        console.log(error);
        this.router.navigate([Routing.LOG_IN]);
        return of(false);
      })
    );
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log('CAN ACTIVE CHILD');
    return this.canActivate(route, state);
  }

  getProfile(): Observable<any> {
    console.log('GET PROFILE');
    return from(
      <Observable<any>>this.usersService.getAuthenticatedUser().pipe(
        map(_ => {
          return true;
        }),
        catchError((res: HttpErrorResponse) => {
          this.authService.signOut().then(_ => {
            this.router.navigate([Routing.LOG_IN]);
          });
          // if (res.status >= 500) {
          //   this.router.navigate([Routing.ERROR]);
          // }
          return of(false);
        })
      )
    );
  }

}

export interface IProfileResponse {
  id?: number;
  name?: string;
  email?: string;
  permissions?: any[];
  projects?: any[];
  settings?: IResponseProjectSettings;
  status?: number; // http reponse status
}

export interface IResponseProjectSettings {
  code?: string;
  name?: string;
  areaUnit?: string;
  currency?: string;
  lease?: boolean;
  slug?: string;
  timeZoneName?: string;
  timeZoneValue?: string;
  addressLine1?: string;
  backgroundImageUrl?: string;
  updatedAt?: number;
}
