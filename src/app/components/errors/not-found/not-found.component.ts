import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/app.settings';
import { Routing } from 'src/app/shared/helpers/routing';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit, AfterViewInit {

  constructor(
    private appSettings: AppSettings,
    private router: Router,
    ) {
  }

  ngOnInit() {
  }

  searchResult(): void {
    this.router.navigate(['/search']);
  }

  ngAfterViewInit() {
  }

  back() {
    this.router.navigate(['/']);
  }

  routeToSignInPage() {
    this.router.navigate([Routing.LOG_IN]);
  }
}
