import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StaffService } from '@features/staff/services/staff.service';
import {
  faChevronDown,
  faEye,
  faPlus,
  faSave,
  faTimes,
  faTruckMoving,
} from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { Router } from '@angular/router';
import { RegisterSelectRtDialogComponent } from '@features/auth/register/components/register-select-rt-dialog/register-select-rt-dialog.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-staff-add',
  templateUrl: './staff-add.component.html',
  styleUrls: ['./staff-add.component.css'],
})
export class StaffAddComponent implements OnInit, OnDestroy, AfterContentInit {
  private destroy$: any = new Subject();
  // Icons
  faEye = faEye;
  faTruckMoving = faTruckMoving;
  faPlus = faPlus;
  faTimes = faTimes;
  faChevronDown = faChevronDown;

  loading = false;
  staffForm: FormGroup;

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,
      action: () => {
        this.submit();
      },
    },
  ];

  role = [
    {
      id: '2',
      name: 'RT',
    },
    {
      id: '3',
      name: 'RW',
    },
  ];

  rw = [];

  constructor(
    private layoutService: LayoutService,
    private staffService: StaffService,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private fcToastService: FcToastService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Tambah Staff',
      icon: '',
      showHeader: true,
    });
    // init form
    this.staffForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      confirm_password: new FormControl(null, Validators.required),
      role: new FormControl(null, Validators.required),
      section_no: new FormControl(null),
      parent: new FormControl(null),
    });
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSelectRW() {
    const ref = this.dialogService.open(RegisterSelectRtDialogComponent, {
      data: {
        title: 'Pilih RW',
      },
      showHeader: false,
      contentStyle: {
        padding: '0',
      },
      style: {
        overflow: 'hidden',
      },
      styleClass: 'rounded-sm',
      dismissableMask: true,
      width: '450px',
    });
    ref.onClose.subscribe((rw) => {
      if (rw) {
        this.staffForm.controls['parent'].setValue(rw);
      }
    });
  }

  removeRW() {
    this.staffForm.controls['parent'].setValue(null);
  }

  submit() {
    if (this.staffForm.valid) {
      if (
        this.staffForm.value.password == this.staffForm.value.confirm_password
      ) {


        let detailRegistration = {
          section_no: String(this.staffForm.value.section_no),
          parent_id: this.staffForm.value.parent
            ? this.staffForm.value.parent.user_id
            : null,
        };

        let bodyReqForm: FormGroup;
        bodyReqForm = new FormGroup({
          name: new FormControl(this.staffForm.value.name),
          email: new FormControl(this.staffForm.value.email),
          password: new FormControl(this.staffForm.value.password),
          role: new FormControl(this.staffForm.value.role),
          detail: new FormControl(detailRegistration),
        });


        this.staffService.createStaff(bodyReqForm.value).subscribe({
          next: (res: any) => {
            this.loading = false;
            this.messageService.clear();
            this.messageService.add({
              severity: 'success',
              summary: 'Registrasi Staff',
              detail: res.message,
            });
            this.router.navigate(['/staff/list']);
          },
          error: (err) => {
            this.loading = false;
            this.messageService.clear();
            this.messageService.add({
              severity: 'error',
              summary: 'Registrasi Staff',
              detail: err.message,
            });
          },
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Register',
          detail: 'Konfirmasi Password Tidak Sama',
        });
      }
    } else {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: 'Register',
        detail: 'Isi semua data dengan benar',
      });
    }
  }
}
