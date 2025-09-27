import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User, CreateUserRequest, UpdateUserRequest } from '../../types/user/user.type';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSwitchModule,
    NzCheckboxModule,
    NzSpinModule
  ],
  template: `
    <nz-modal
      [nzVisible]="isVisible"
      [nzTitle]="title"
      [nzWidth]="600"
      [nzOkText]="okText"
      [nzCancelText]="'Cancel'"
      [nzOkLoading]="isLoading"
      [nzClosable]="!isLoading"
      [nzMaskClosable]="!isLoading"
      (nzOnCancel)="handleCancel()"
      (nzOnOk)="handleOk()"
    >
      <ng-container *nzModalContent>
        <nz-spin [nzSpinning]="isLoading">
          <form nz-form [formGroup]="userForm" nzLayout="vertical">
            <!-- Email -->
            <nz-form-item>
              <nz-form-label nzRequired>Email</nz-form-label>
              <nz-form-control nzErrorTip="Please enter a valid email address">
                <input
                  nz-input
                  formControlName="email"
                  placeholder="user@example.com"
                  type="email"
                  [disabled]="isEditMode && !canEditEmail"
                />
              </nz-form-control>
            </nz-form-item>

            <!-- Password (only for create mode) -->
            <nz-form-item *ngIf="!isEditMode">
              <nz-form-label nzRequired>Password</nz-form-label>
              <nz-form-control nzErrorTip="Password must be at least 8 characters">
                <input
                  nz-input
                  formControlName="password"
                  placeholder="Enter password"
                  type="password"
                />
              </nz-form-control>
            </nz-form-item>

            <!-- First Name -->
            <nz-form-item>
              <nz-form-label nzRequired>First Name</nz-form-label>
              <nz-form-control nzErrorTip="Please enter first name">
                <input
                  nz-input
                  formControlName="firstName"
                  placeholder="John"
                />
              </nz-form-control>
            </nz-form-item>

            <!-- Last Name -->
            <nz-form-item>
              <nz-form-label nzRequired>Last Name</nz-form-label>
              <nz-form-control nzErrorTip="Please enter last name">
                <input
                  nz-input
                  formControlName="lastName"
                  placeholder="Doe"
                />
              </nz-form-control>
            </nz-form-item>

            <!-- Is Active -->
            <nz-form-item>
              <nz-form-label>Active Status</nz-form-label>
              <nz-form-control>
                <label nz-checkbox formControlName="isActive">
                  User account is active
                </label>
              </nz-form-control>
            </nz-form-item>

            <!-- Must Change Password -->
            <nz-form-item>
              <nz-form-label>Password Policy</nz-form-label>
              <nz-form-control>
                <label nz-checkbox formControlName="mustChangePassword">
                  User must change password on next login
                </label>
              </nz-form-control>
            </nz-form-item>
          </form>
        </nz-spin>
      </ng-container>
    </nz-modal>
  `,
  styles: [`
    :host ::ng-deep .ant-modal-body {
      padding: 24px;
    }

    :host ::ng-deep .ant-form-item {
      margin-bottom: 16px;
    }

    :host ::ng-deep .ant-form-item:last-child {
      margin-bottom: 0;
    }
  `]
})
export class UserFormModalComponent implements OnInit {
  @Input() isVisible = false;
  @Input() user?: User;
  @Input() isLoading = false;
  @Input() canEditEmail = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<CreateUserRequest | UpdateUserRequest>();

  userForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.user) {
      this.isEditMode = true;
      this.patchFormValues();
    }
  }

  get title(): string {
    return this.isEditMode ? 'Edit User' : 'Create New User';
  }

  get okText(): string {
    return this.isEditMode ? 'Update' : 'Create';
  }

  private initForm(): void {
    const formConfig: any = {
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      isActive: [true],
      mustChangePassword: [false]
    };

    if (!this.isEditMode) {
      formConfig.password = ['', [Validators.required, Validators.minLength(8)]];
    } 

    this.userForm = this.fb.group(formConfig);
  }

  private patchFormValues(): void {
    if (this.user) {
      this.userForm.patchValue({
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        isActive: this.user.isActive,
        mustChangePassword: this.user.mustChangePassword
      });
    }
  }

  handleOk(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      if (this.isEditMode) {
        // For update, only send changed fields
        const updateData: UpdateUserRequest = {};

        if (formValue.email !== this.user?.email && this.canEditEmail) {
          updateData.email = formValue.email;
        }
        if (formValue.firstName !== this.user?.firstName) {
          updateData.firstName = formValue.firstName;
        }
        if (formValue.lastName !== this.user?.lastName) {
          updateData.lastName = formValue.lastName;
        }
        if (formValue.isActive !== this.user?.isActive) {
          updateData.isActive = formValue.isActive;
        }
        if (formValue.mustChangePassword !== this.user?.mustChangePassword) {
          updateData.mustChangePassword = formValue.mustChangePassword;
        }

        this.onSave.emit(updateData);
      } else {
        // For create, send all fields
        const createData: CreateUserRequest = {
          email: formValue.email,
          password: formValue.password,
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          isActive: formValue.isActive,
          mustChangePassword: formValue.mustChangePassword
        };

        this.onSave.emit(createData);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.controls[key];
        if (!control) {
          return;
        }
        control.markAsDirty();
        control.updateValueAndValidity();
      }); 
      this.message.error('Please fix the form errors');
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.visibleChange.emit(false);
    this.userForm.reset();
  }
}