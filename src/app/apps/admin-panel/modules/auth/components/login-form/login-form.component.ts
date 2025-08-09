import { Component, signal, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// ng-zorro imports
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { IAuthService } from '../../services/auth-service/auth-service.inteface';
import { LoginCredentials } from '../../types/login-credentials/login-credentials.type';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzAlertModule,
    NzCardModule,
    NzIconModule,
    NzDividerModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  // Dependencies
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(IAuthService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  // Signals
  isLoading = signal(false);
  authError = signal<string | null>(null);
  passwordVisible = signal(false);

  // Form
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.performLogin();
    } else {
      this.markFormGroupTouched();
    }
  }

  private performLogin(): void {
    this.isLoading.set(true);
    this.authError.set(null);

    const credentials: LoginCredentials = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
      rememberMe: this.loginForm.get('rememberMe')?.value,
    };

    this.authService.login(credentials).subscribe({
      next: response => {
        this.isLoading.set(false);

        if (response?.success && response.data) {
          this.message.success('Login successful!');
          this.router.navigate(['/admin-panel']);
        } else {
          const errorMessage = response?.errors?.[0]?.message || 'Login failed';
          this.authError.set(errorMessage);
        }
      },
      error: error => {
        this.isLoading.set(false);
        const errorMessage = error?.error?.errors?.[0]?.message || 'An unexpected error occurred';
        this.authError.set(errorMessage);
        this.message.error('Login failed. Please try again.');
      },
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  navigateToRegister(): void {
    this.router.navigate(['/admin-panel/auth/register']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/admin-panel/auth/forgot-password']);
  }
}
