import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import {
  faChevronDown,
  faSave,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';
import { UserProfileService } from './services/user-profile.service';
import { DialogService } from 'primeng/dynamicdialog';
import { RegisterSelectRtDialogComponent } from '@features/auth/register/components/register-select-rt-dialog/register-select-rt-dialog.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  private readonly destroy$ = new Subject<void>();
  // Icons
  faTimes = faTimes;
  faChevronDown = faChevronDown;

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,
      action: () => {
        this.submit();
      },
    },
  ];
  gender = [
    {
      id: '0',
      name: 'Laki-Laki',
    },
    {
      id: '1',
      name: 'Perempuan',
    },
  ];

  religion = [
    {
      id: 1,
      name: 'Islam',
    },
    {
      id: 2,
      name: 'Kristen Protestan',
    },
    {
      id: 3,
      name: 'Katolik',
    },
    {
      id: 4,
      name: 'Hindu',
    },
    {
      id: 5,
      name: 'Budha',
    },
    {
      id: 6,
      name: 'Konghucu',
    },
  ];

  user: any = {} as any;
  rt = [];

  loading = true;

  userForm: FormGroup;
  confirmPassword: string = '';
  constructor(
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userProfile: UserProfileService,
    private fcToastService: FcToastService,
    private dialogService: DialogService
  ) {
    this.user.id = String(this.route.snapshot.paramMap.get('userId'));

    this.layoutService.setHeaderConfig({
      title: 'Update Profile',
      icon: '',
      showHeader: true,
    });
    this.layoutService.setSearchConfig({
      hide: true,
    });
    // init form
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      birth_place: new FormControl('', Validators.required),
      birth_date: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      nik: new FormControl('', Validators.required),
      rt: new FormControl(null, Validators.required),
      rw: new FormControl(null, Validators.required),
      phone_no: new FormControl(null, Validators.required),
      religion: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    this.authService.currentUserDataSubject.subscribe((user: any) => {
      if (user) {
        this.user = user;
        if (this.user.role > 0 || this.user.civilian?.status < 1) {
          this.actionButtons[0].hidden = true;
        }

        this.userForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          birth_place: this.user.civilian?.birth_place,
          birth_date: this.user.civilian?.birth_date,
          gender: this.user.civilian?.gender,
          nik: this.user.civilian?.nik,
          rt: this.user.civilian?.rt,
          rw: this.user.civilian?.rw,
          phone_no: this.user.civilian?.phone_no,
          religion: this.user.civilian?.religion,
        });
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
    let detailRegistration = {
      birth_place: this.userForm.value.birth_place,
      birth_date: this.userForm.value.birth_date,
      gender: String(this.userForm.value.gender),
      nik: this.userForm.value.nik,
      phone_no: String(this.userForm.value.phone_no),
      religion: this.userForm.value.religion,
      rt: this.userForm.value.rt,
      rw: this.userForm.value.rw,
    };

    let bodyReqForm: FormGroup;
    bodyReqForm = new FormGroup({
      name: new FormControl(this.userForm.value.name),
      detail: new FormControl(detailRegistration),
    });
    this.actionButtons[0].loading = true;
    this.userProfile.updateUserProfile(bodyReqForm.value).subscribe({
      next: (res: any) => {
        this.actionButtons[0].loading = false;
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'success',
          header: 'Update Profile',
          message: res.message,
        });
      },
      error: (err: any) => {
        this.actionButtons[0].loading = false;
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'error',
          header: 'Update Profile',
          message: err.message,
        });
      },
    });
  }
}
