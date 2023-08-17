import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { User } from '@features/customer/interfaces/customer';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';
import { UserProfileService } from './services/user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  private readonly destroy$ = new Subject<void>();

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,
      action: () => {
        this.submit();
      },
    },
  ];
  user: User = {} as User;

  loading = true;

  userForm: FormGroup;
  confirmPassword: string = '';
  constructor(
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userProfile: UserProfileService,
    private fcToastService: FcToastService
  ) {
    this.user.id = String(this.route.snapshot.paramMap.get('userId'));

    this.layoutService.setHeaderConfig({
      title: 'User Setting',
      icon: '',
      showHeader: true,
    });
    this.layoutService.setSearchConfig({
      hide: true,
    });
    // init form
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      phone_no: new FormControl('', Validators.required),
      staff: new FormGroup({
        note: new FormControl(''),
      }),
    });
  }
  ngOnInit(): void {
    this.authService.currentUserDataSubject.subscribe((user: any) => {
      if (user) {
        this.user = user;
        this.userForm.patchValue(this.user);
        this.loading = false;
      }
    });
  }

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.layoutService.setSearchConfig({
      hide: false,
    });
  }

  submit() {
    this.actionButtons[0].loading = true;
    this.userProfile.updateUserProfile(this.userForm.value).subscribe({
      next: (res: any) => {
        this.actionButtons[0].loading = false;
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'success',
          header: 'User Profile',
          message: res.message,
        });
      },
      error: (err: any) => {
        this.actionButtons[0].loading = false;
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'error',
          header: 'User Profile',
          message: err.message,
        });
      },
    });
  }
}
