import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpResponse, HttpHandler, HttpErrorResponse } from '@angular/common/http';

import { Observable, from } from 'rxjs';
import { tap, switchMap, finalize } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Location } from '@angular/common';
import { PageLoadingService } from './page-loading.service';

@Injectable()
export class HttpInterceptorCustomService implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private pageLoadingService: PageLoadingService,
    private location: Location,
    ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('*********************************');
    // console.log('PAGE LOADING');
    this.pageLoadingService.loading(true);
    try {
      return from(<Promise<any>>this.authService.getIdToken()).pipe(
        switchMap(token => {
          return this.handle(req, token, next);
        })
      );
    } catch (error) {
      return this.handle(req, '', next);
    }
  }

  handle(req: HttpRequest<any>, token: any, next: HttpHandler): Observable<HttpEvent<any>> {
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    // console.log(token);
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // do stuff with response if you want
        }
      }, error => {
        // console.log(error);
        if (error instanceof Error) {
          // A client side or network error occurred.
          console.log('Client: ');
        } else if (error instanceof HttpErrorResponse) {
          // The backend returned an unsuccessful response code.
          console.log('Server: ');
          this.handleServerError(error);
        }
        if (error.error instanceof ProgressEvent) {
          error['router'] = this.router.url;
          // this.router.navigate([Url.ERROR, error], { skipLocationChange: true });
        } else {
          // error will be handled in snackbar's current page.
        }
      }),
      finalize(() => {
        // console.log('PAGE NOT LOADING');
        // console.log('*********************************');
        this.pageLoadingService.loading(false);
      })
    );
  }

  handleServerError(error) {
    console.log(error);
    if (error.status >= 500 || error.status === 0) {
      // this.router.navigate([Routing.ERROR]);
      return;
    }
    console.log(this.location.path());
    switch (error.status) {
      case 400:
        // const path = this.location.path();
        // if (path.includes('/account/signup')) {
        //   this.snackbar.open({ message: 'Token is expired', type: SNACKBAR.TYPE.ERROR });
        // }
        break;
      case 403:
        // this.router.navigate([Routing.NOT_PERMISSION]);
        break;
      case 404:
        // this.router.navigate([Routing.NOT_FOUND]);
        break;
    }
  }
}
