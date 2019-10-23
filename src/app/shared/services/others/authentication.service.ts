import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  authenticated$: Observable<boolean>;
  currentUser$: Observable<firebase.User>;

  constructor(
    public afAuth: AngularFireAuth,
    private http: HttpClient
  ) {
    this.authenticated$ = afAuth.authState.pipe(map(user => !!user));
    this.currentUser$ = afAuth.authState;
  }

  signInWithPhoneNumber(data: {
    phoneNumber: string;
    applicationVerifier: any
  }): Promise<any> {
    return this.afAuth.auth.signInWithPhoneNumber(data.phoneNumber, data.applicationVerifier);
  }

  signInWithCustomToken(customToken: string): Promise<any> {
    console.log(customToken);
    return this.afAuth.auth.signInWithCustomToken(customToken);
  }

  getIdToken(): Promise<any> {
    return this.afAuth.auth.currentUser.getIdToken();
  }

  signOut(): Promise<any> {
    // UserProfile.setAllowGetProfile(false);
    return this.afAuth.auth.signOut().catch(_ => {
      // UserProfile.setAllowGetProfile(true);
    });
  }

}


