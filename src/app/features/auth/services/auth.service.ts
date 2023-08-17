import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '@shared/services/cookie.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const ROOT_API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserTokensSubject: BehaviorSubject<string>;
  currentUserDataSubject: BehaviorSubject<string>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.currentUserTokensSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('access_token') as string)
    );
    this.currentUserDataSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('user') as string)
    );
  }

  public get getCurrentUserTokens() {
    return this.currentUserTokensSubject.value;
  }
  public get getCurrentUserData() {
    return this.currentUserDataSubject;
  }

  login(loginData: any) {
    return this.http.post(ROOT_API_URL + '/admin/auth/login', loginData).pipe(
      map((res: any) => {
        if (res.statusCode == 200) {
          // set cookie
          localStorage.setItem(
            'access_token',
            JSON.stringify(res.data.access_token)
          );
          this.currentUserTokensSubject.next(res.data.access_token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          this.currentUserDataSubject.next(res.data.user);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  // check if user is logged in
  isLoggedIn() {
    if (this.currentUserTokensSubject.value) {
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserTokensSubject.next('');
    this.currentUserDataSubject.next('');
    this.router.navigate(['/auth/login']);
  }
  updateUserData(user: any) {
    this.currentUserDataSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
  register(registerData: any) {
    return this.http.post(ROOT_API_URL + '/admin/auth/register', registerData);
  }
}
