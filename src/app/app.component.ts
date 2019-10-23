import { Component, ViewEncapsulation, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { APP_THEME } from './app.model';
import { AppSettings } from './app.settings';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'app';
  themeClass = APP_THEME.SKIN.NONE;
  items: Observable<any[]>;
  private ngUnsubscribe = new Subject();
  // firebaseRef: AngularFirestoreCollection;

  constructor(
    public appSettings: AppSettings,
    private cdr: ChangeDetectorRef  ) {
    // this.firebaseRef = db.collection('projects/111/users/222/notifications');
    // this.items = this.firebaseRef.valueChanges();
    // this.items.subscribe(_ => {
    //   this.firebaseRef.get().subscribe((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       console.log(doc.id, doc.data());
    //     });
    //   });
    // });
    // this.firebaseRef.stateChanges().subscribe((res) => {
    //   console.log(res);
    // });
  }

  ngOnInit() {
    // this.settings = this.appSettings.settings;
    // this.handleThemesForCdkOverlayContainer();
  }

  ngAfterViewInit() {
    // this.settings.loadingSpinner = false;
    // this.translate.use('en');
    // this.detectChanges();
    // this.communication.changeEmitted$.subscribe(res => {
    //   console.log(res);
    //   this.isLoadingSpinner = res.loadingSpinner;
    //   this.detectChanges();
    // });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  detectChanges() {
    this.cdr.detectChanges();
  }

  routeTo() {
    // this.router.navigate([routing]);
  }

  switchTheme() {
    // if (this.themeClass === APP_THEME.SKIN.DEFAULT) {
    //   this.themeClass = APP_THEME.SKIN.BLUE_DARK;
    // } else {
    //   this.themeClass = APP_THEME.SKIN.DEFAULT;
    // }
    // this.handleThemesForCdkOverlayContainer();
  }

  handleThemesForCdkOverlayContainer() {
    // const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    // const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme'));
    // if (themeClassesToRemove.length) {
    //   overlayContainerClasses.remove(...themeClassesToRemove);
    // }
    // overlayContainerClasses.add(this.themeClass);
  }
}
