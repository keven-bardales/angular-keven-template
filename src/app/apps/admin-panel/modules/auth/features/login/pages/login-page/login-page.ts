// src/app/apps/admin-panel/modules/auth/features/login/pages/login-page/login-page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LoginFormComponent } from '../../../../components/login-form/login-form.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, NzIconModule, LoginFormComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  // The login page now uses the dedicated login form component
  // All login logic is handled in the LoginFormComponent
}
