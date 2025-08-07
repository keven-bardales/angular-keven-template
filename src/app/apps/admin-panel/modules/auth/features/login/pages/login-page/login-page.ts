// src/app/apps/admin-panel/modules/auth/features/login/pages/login-page/login-page.ts
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { LoginCredentials } from '../../../../types/login-credentials/login-credentials.type';
import { IAuthService } from '../../../../services/auth-service/auth-service.inteface';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(IAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  // Form and UI state
  protected readonly loginForm: FormGroup;
  protected readonly hidePassword = signal(true);
  protected readonly isSubmitting = computed(() => this.authService.isLoading());

  // Demo credentials info
  protected readonly showDemoCredentials = signal(true);
  protected readonly demoCredentials = [
    { email: 'admin@example.com', password: 'admin123', role: 'Administrator' },
    { email: 'user@example.com', password: 'user123', role: 'Regular User' }
  ];

  constructor() {
    this.loginForm = this.createLoginForm();
    this.checkAuthMessage();
  }

  private createLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  private checkAuthMessage(): void {
    const message = this.route.snapshot.queryParams['message'];
    if (message) {
      this.snackBar.open(message, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  protected togglePasswordVisibility(): void {
    this.hidePassword.update(hidden => !hidden);
  }

  protected fillDemoCredentials(credentials: { email: string; password: string }): void {
    this.loginForm.patchValue({
      email: credentials.email,
      password: credentials.password
    });
    this.showDemoCredentials.set(false);
  }

  protected toggleDemoCredentials(): void {
    this.showDemoCredentials.update(show => !show);
  }

  protected onSubmit(): void {
    if (this.loginForm.valid && !this.isSubmitting()) {
      const credentials: LoginCredentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.snackBar.open(
            response?.message || 'Login successful!',
            'Close',
            {
              duration: 3000,
              panelClass: ['success-snackbar']
            }
          );

          // Handle redirect
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin-panel';
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          this.snackBar.open(
            error.message || 'Login failed. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  protected navigateToRegister(): void {
    this.router.navigate(['/admin-panel/auth/register']);
  }

  protected navigateToForgotPassword(): void {
    this.router.navigate(['/admin-panel/auth/forgot-password']);
  }

  protected getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Password must be at least ${requiredLength} characters long`;
      }
    }
    return '';
  }

  protected hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: Record<string, string> = {
      email: 'Email',
      password: 'Password'
    };
    return displayNames[fieldName] || fieldName;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
