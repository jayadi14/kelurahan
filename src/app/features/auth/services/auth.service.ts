import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Ability, AbilityBuilder } from '@casl/ability';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
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
    private cookieService: CookieService,
    private ability: Ability
  ) {
    this.currentUserTokensSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('access_token') as string)
    );
    this.currentUserDataSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('user') as string)
    );
    if (this.currentUserTokensSubject.value) {
      this.updateAbility(this.currentUserDataSubject.value);
    }
  }

  public get getCurrentUserTokens() {
    return this.currentUserTokensSubject.value;
  }
  public get getCurrentUserData() {
    return this.currentUserDataSubject;
  }

  login(loginData: any) {
    return this.http.post(ROOT_API_URL + '/auth/login', loginData).pipe(
      map((res: any) => {
        if (res.code == 200) {
          // set cookie
          localStorage.setItem(
            'access_token',
            JSON.stringify(res.data.access_token)
          );
          this.currentUserTokensSubject.next(res.data.access_token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          this.currentUserDataSubject.next(res.data.user);
          if (res.data.user.civilian?.status == 2) {
            this.router.navigate(['/user-profile']);
          } else {
            this.router.navigate(['/']);
          }
          this.updateAbility(res.data.user);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  getArea(dataListParameter: DataListParameter = {} as DataListParameter) {
    let param = '';
    if (dataListParameter.rows && dataListParameter.page) {
      param = param.concat(
        `?page=${dataListParameter.page}&limit=${dataListParameter.rows}`
      );
    }
    if (dataListParameter.sortBy) {
      param = param.concat('&' + dataListParameter.sortBy);
    }
    if (dataListParameter.filterObj) {
      param = param.concat('&' + dataListParameter.filterObj);
    }

    if (dataListParameter.searchQuery) {
      if (!dataListParameter.sortBy) {
        param = param.concat('?q=' + dataListParameter.searchQuery);
      } else {
        param = param.concat('&q=' + dataListParameter.searchQuery);
      }
    }
    return this.http.get(`${ROOT_API_URL}/area${param}`);
  }

  // check if user is logged in
  isLoggedIn() {
    if (this.currentUserTokensSubject.value) {
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('access_token');
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
    return this.http.post(ROOT_API_URL + '/auth/register', registerData);
  }
  private updateAbility(user: any) {
    const { can, rules } = new AbilityBuilder(Ability);
    can('read', 'all');
    this.ability.update(rules);
  }
}
