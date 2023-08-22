import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DarkModeService } from 'src/app/shared/services/dark-mode.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DialogService } from 'primeng/dynamicdialog';
import { RegisterSelectRtDialogComponent } from './components/register-select-rt-dialog/register-select-rt-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading: boolean = false;
  darkMode: any;
  // Icons
  faTimes = faTimes
  faChevronDown = faChevronDown

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

  rt = [];

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

  constructor(
    private authService: AuthService,
    private darkModeService: DarkModeService,
    private router: Router,
    private messageService: MessageService,
    private dialogService: DialogService,
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required),
      birth_place: new FormControl('', Validators.required),
      birth_date: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      nik: new FormControl(null, Validators.required),
      rt: new FormControl(null, Validators.required),
      rw: new FormControl(null, Validators.required),
      phone_no: new FormControl('', Validators.required),
      religion: new FormControl(null, Validators.required),
    });
    this.darkModeService.getDarkModeStatus.subscribe((darkMode) => {
      this.darkMode = darkMode;
    });
  }

  ngOnInit(): void {}

  onSelectRW(){
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
        this.registerForm.controls['rw'].setValue(rw);
        this.rt = rw.children
      }
    });
  }

  removeRW(){
    this.registerForm.controls['rw'].setValue('');
    this.registerForm.controls['rt'].setValue('');
  }

  submit() {
    if(this.registerForm.valid){
      if(this.registerForm.value.password == this.registerForm.value.confirm_password){
        let detailRegistration = {
          birth_place: this.registerForm.value.birth_place,
          birth_date: this.registerForm.value.birth_date,
          gender: this.registerForm.value.gender,
          nik: this.registerForm.value.nik,
          rt: this.registerForm.value.rt,
          rw: this.registerForm.value.rw.section_no,
          phone_no: this.registerForm.value.phone_no,
          religion: this.registerForm.value.religion,
        }
        let currentBirthDate = detailRegistration.birth_date
        detailRegistration.birth_date = currentBirthDate.transform(currentBirthDate, 'yyyy-MM-ddTHH:mm:ss.00');
        detailRegistration.birth_date = detailRegistration.birth_date.toISOString()
        let bodyReqForm: FormGroup;
        bodyReqForm = new FormGroup({
          name: new FormControl(
            (this.registerForm.value.name)
          ),
          email: new FormControl(
            (this.registerForm.value.email)
          ),
          password: new FormControl(
            (this.registerForm.value.password)
          ),
          detail: new FormControl(
            (detailRegistration)
          ),
        })
        console.log(bodyReqForm.value)
        // this.authService.register(bodyReqForm.value).subscribe({
        //   next: (res: any) => {
        //     this.loading = false;
        //     this.messageService.clear();
        //     this.messageService.add({
        //       severity: 'success',
        //       summary: 'Register',
        //       detail: res.message,
        //     });
        //     this.router.navigate(['/auth/login']);
        //   },
        //   error: (err) => {
        //     this.loading = false;
        //     this.messageService.clear();
        //     this.messageService.add({
        //       severity: 'error',
        //       summary: 'Register',
        //       detail: err.message,
        //     });
        //   },
        // });
      }else{
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Register',
          detail: 'Konfirmasi Password Tidak Sama',
        });
      }
    }else{
      this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Register',
          detail: 'Isi semua data dengan benar',
        });
    }

  }
}
