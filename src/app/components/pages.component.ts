import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav, MatMenuTrigger } from '@angular/material';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';



import { AuthenticationService } from '../shared/services/others/authentication.service';
import { Routing } from '../shared/helpers/routing';
import { UserProfile } from '../shared/models/user.profile.namespace';
import { ROLE } from '../shared/helpers/const';
import { MenuSidenav } from '../menu-sidenav.model';
import { ApiNDP } from '../shared/helpers/api';
import { Location } from '@angular/common';
import { Utils } from '../shared/helpers/utilities';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagesComponent implements OnInit, AfterViewInit {

  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;
  @ViewChild('sidenavContent', {static: false}) sidenavContent: ElementRef;
  @ViewChild('notificationsMenuTrigger', {static: false}) trigger: MatMenuTrigger;


  private routerLink = '';
  private ngUnsubscribe = new Subject();
  private loadFirstTime = true;

  isAdmin = (UserProfile.getRole() === ROLE.ADMINISTRATOR) ? true : false;
  menuList = MenuSidenav.GetMenus();
  sidenavIsPinned = false;
  title = '';
  pageLoading = false;
  firebaseRef: AngularFirestoreCollection;
  notificationsList: Observable<any[]>;
  isProgressing = false;
  NOTIFICATION_TYPES = NOTIFICATION_TYPES;
  userName = UserProfile.getUserName();
  isNewNotification = false;
  searchString = '';
  searchChange = new Subject<string>();
  showSearchInput = false;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    // private pageLoadingService: PageLoadingService,
    private cdr: ChangeDetectorRef,
    private db: AngularFirestore,
    private location: Location
  ) {
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res instanceof NavigationEnd) {
        console.log('router change');
        this.showSearchInput = false;
        if (res.url === '/') {
          this.title = 'Trang chủ';
        } else if (res.url.includes('/manager')) {
          this.title = 'Quản lý';
        } else if (res.url.includes('/ratings')) {
          this.title = 'Phiểu';
        } else if (res.url.includes('/reports')) {
          this.title = 'Báo cáo tổng';
        } else if (res.url.includes('/daily-reports')) {
          this.title = 'Ghi nhận ngày';
        } else if (res.url.includes('/rating-reports')) {
          this.title = 'Báo cáo phiểu';
        } else if (res.url.includes('/contacts')) {
          this.title = 'Khách hàng';
          this.showSearchInput = true;
        } else if (res.url.includes('/telesales-reports')) {
          this.title = 'Báo cáo telesales';
        } else if (res.url.includes('/contact-sources')) {
          this.title = 'Nguồn khách hàng';
        } else {
          this.title = 'Không xác định';
        }
      }
    });
    this.firebaseRef = db.collection(`${ApiNDP.Users}/${UserProfile.getUserId()}/${ApiNDP.Notifications}`, ref => ref.orderBy('StartedAt', 'desc').limit(10));
  }

  ngOnInit() {
    this.setSearchChange();
    this.notificationsList = this.firebaseRef.valueChanges().pipe(map(res => {
      let count = 0;
      res.forEach((item: NotificationModel) => {
        item.seeDetail = false;
        if (item.CompletedAt === 0) {
          count += 1;
        }
      });
      if (count > 0) {
        this.isProgressing = true;
      } else {
        this.isProgressing = false;
      }
      if (this.loadFirstTime) {
        this.loadFirstTime = false;
      } else {
        // this.trigger.openMenu();
        this.isNewNotification = true;
      }
      return res;
    }));
  }

  ngAfterViewInit() {
    // this.pageLoadingService.loading$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(loadingList => {
    //   if (loadingList.length === 0) {
    //     this.pageLoading = false;
    //     console.log(this.pageLoading);
    //     this.detectChanges();
    //   } else if (loadingList.length > 0) {
    //     if (this.pageLoading === false) {
    //       this.pageLoading = true;
    //       console.log(this.pageLoading);
    //       this.detectChanges();
    //     }
    //   }
    // });
  }

  detectChanges() {
    this.cdr.detectChanges();
  }

  routeToDashboardPage() {
    this.router.navigate(['/']);
  }

  routeToManagerPage() {
    this.router.navigate([Routing.MANAGER]);
  }

  signOut() {
    this.auth.signOut().then(_ => {
      this.router.navigate([Routing.LOG_IN]);
    });
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  openPage(links: string[]) {
    const founded = links.findIndex(x => x === 'forms');
    if (founded > -1) {
          links.splice(founded, 1);
    }
    this.routerLink = links.join('/');
    console.log(links);
    console.log(this.routerLink);
    if (this.routerLink === Routing.REPORTS) {
      const date = new Date(), y = date.getFullYear(), m = date.getMonth(),
          dateStartMonth = new Date(y, m, 1),
          dateEndMonth = new Date(y, m + 1, 0);
        const temp = {
          fromDate: Utils.DateTime.convertDateStringDDMMYYYY(dateStartMonth),
          toDate: Utils.DateTime.convertDateStringDDMMYYYY(dateEndMonth)
        };
        this.router.navigate([Routing.REPORTS], { queryParams: temp });
    } else {
      this.router.navigate([this.routerLink]);
    }
  }

  changeDetailState(notification: NotificationModel) {
    notification.seeDetail = !notification.seeDetail;
  }

  download(url: string) {
    console.log(url);
    if (url.toLowerCase().match('/gif|jpg|jpeg|png/')) {
      window.open(url, '_blank');
    } else {
      window.open(url, '_self');
    }
  }

  openMessagesMenu() {
    this.trigger.openMenu();
  }

  stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  hideNewNotification() {
    this.isNewNotification = false;
  }

  changeSearchString(value: string) {
    this.searchChange.next(value);
  }

  setSearchChange() {
    this.searchChange.pipe(debounceTime(500), distinctUntilChanged()).subscribe(value => {
      if (value !== null) {
        this.handleSearchString(value);
      }
    });
  }

  handleSearchString(value: string) {
    const path = this.location.path();
    if (path.includes('/contacts')) {
      this.router.navigate([Routing.CONTACTS], { queryParams: { q: value }});
    }
  }

  checkCopyText() {
    const { allow, value } = UserProfile.checkCopyText();
    if (allow) {
      UserProfile.clearCopyText();
      this.searchString = value;
      this.searchChange.next(value);
    }
  }

}


const NOTIFICATION_TYPES = {
  IMPORT_CONTACTS: 'ImportContacts',
  EXPORT_CONTACTS: 'ExportContacts'
};

class NotificationModel {
  CompletedAt: number;
  DownloadUrl: string;
  ErrorCount: number;
  StartedAt: number;
  SuccessCount: number;
  Type: string;

  // custom
  seeDetail: boolean;
}

interface INotificationsHandled {
  status: string;
  list: NotificationModel[];
}


