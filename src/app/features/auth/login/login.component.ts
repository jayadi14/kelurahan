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
  selector: 'fc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;
  darkMode: any;
  constructor(
    private authService: AuthService,
    private darkModeService: DarkModeService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    this.darkModeService.getDarkModeStatus.subscribe((darkMode) => {
      this.darkMode = darkMode;
    });
  }

  ngOnInit(): void {}
  get loginFormControl() {
    return this.loginForm.controls;
  }

  submit() {
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        if (res) {
          this.router.navigate(['/']);
        }
        this.loading = false;
      },
      error: (err) => {
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Login',
          detail: err.message,
        });
        this.loading = false;
      },
    });
  }
}
