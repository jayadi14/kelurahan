import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { AuthService } from '@features/auth/services/auth.service';
import { map } from 'rxjs';

const ROOT_API = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private http: HttpClient, private authService: AuthService) {}
  updateUserProfile(user: any) {
    return this.http.put(`${ROOT_API}/admin/users/profile`, user).pipe(
      map((res: any) => {
        this.authService.updateUserData(res.data);
        return res;
      })
    );
  }
}
