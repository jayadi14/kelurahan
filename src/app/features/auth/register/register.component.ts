import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DarkModeService } from 'src/app/shared/services/dark-mode.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading: boolean = false;
  darkMode: any;

  gender = [
    {
      id: 1,
      name: 'Laki-Laki',
    },
    {
      id: 2,
      name: 'Perempuan',
    },
  ];

  rt = [
    {
      id: 1,
      name: '01',
    },
    {
      id: 2,
      name: '02',
    },
  ];

  rw = [
    {
      id: 1,
      name: '01',
    },
    {
      id: 2,
      name: '02',
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

  constructor(
    private authService: AuthService,
    private darkModeService: DarkModeService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = new FormGroup({
      email: new FormControl('', Validators.required),
      phone_number: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      birth_date: new FormControl(null, Validators.required),
      birth_place: new FormControl('', Validators.required),
      gender: new FormControl(1, Validators.required),
      religion: new FormControl(1, Validators.required),
      nik: new FormControl(null, Validators.required),
      rt: new FormControl(1, Validators.required),
      rw: new FormControl(1, Validators.required),
    });
    this.darkModeService.getDarkModeStatus.subscribe((darkMode) => {
      this.darkMode = darkMode;
    });
  }

  ngOnInit(): void {}
  get loginFormControl() {
    return this.registerForm.controls;
  }

  submit() {}
}
