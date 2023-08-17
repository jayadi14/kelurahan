import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private fcToastService: FcToastService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(1),
      catchError((e) => {
        if (e.status == 400) {
          this.messageService.clear();
          let messages = '';

          // this.messageService.add({
          //   severity: 'error',
          //   summary: e.error.response.error,
          //   detail: messages,
          // });
        } else if (e.status == 401) {
          // clear local storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          this.authService.currentUserDataSubject.next('');
          this.authService.currentUserTokensSubject.next('');
          this.router.navigate(['/auth/login']);
          // this.fcToastService.add({
          //   header: 'Login',
          //   message:
          //     'Your session has expired, Please login again',
          //   lottieOption: {
          //     path: '/assets/lotties/warning.json',
          //     loop: false,
          //   },
          // });
        } else if (e.status == 404) {
          this.router.navigate(['/error/not-found']);
        }
        const error = e.error;
        return throwError(error);
      })
    );
  }
}
