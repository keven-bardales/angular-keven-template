import { Component, inject, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { UserToken } from '../../services/user';
import { User, CreateUserRequest, UpdateUserRequest } from '../../types/user/user.type';
import { CrudPageComponent } from '../../../../../../../../shared/components/crud-page/crud-page.component';
import {
  DataTableComponent,
  ColumnConfig,
  TableAction,
  PaginationConfig,
} from '../../../../../../../../shared/components/data-table/data-table.component';
import { UserFormModalComponent } from '../../components/user-form-modal/user-form-modal.component';
import { UserListParams } from '../../services/user/user-service.interface';

@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [
    CommonModule,
    CrudPageComponent,
    DataTableComponent,
    UserFormModalComponent,
    NzTagModule,
    NzIconModule,
  ],
  templateUrl: './user-list-page.html',
  styleUrl: './user-list-page.scss',
})
export class UserListPage implements OnInit, OnDestroy {
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;

  private userService = inject(UserToken);
  private message = inject(NzMessageService);
  private destroy$ = new Subject<void>();

  // Table data
  users: User[] = [];
  columns: ColumnConfig<User>[] = [];
  actions: TableAction[] = [];
  loading = false;

  // Pagination
  pagination: PaginationConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: [10, 20, 50, 100],
  };

  // Modal
  showUserModal = false;
  selectedUser: User | null = null;
  modalLoading = false;

  // Search
  searchValue = '';

  ngOnInit(): void {
    this.setupTableColumns();
    this.setupTableActions();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupTableColumns(): void {
    this.columns = [
      {
        key: 'fullName',
        title: 'Name',
        sortable: true,
        sortFn: (a: User, b: User) => a.fullName.localeCompare(b.fullName),
      },
      {
        key: 'email',
        title: 'Email',
        sortable: true,
        sortFn: (a: User, b: User) => a.email.localeCompare(b.email),
      },
      {
        key: 'isActive',
        title: 'Status',
        width: '120px',
        customRender: this.statusTemplate,
        filterMultiple: false,
        listOfFilter: [
          { text: 'Active', value: true },
          { text: 'Inactive', value: false },
        ],
        filterFn: (value: boolean, item: User) => item.isActive === value,
      },
      {
        key: 'createdAt',
        title: 'Created Date',
        width: '150px',
        customRender: this.dateTemplate,
        sortable: true,
        sortFn: (a: User, b: User) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      },
      {
        key: 'mustChangePassword',
        title: 'Password',
        width: '150px',
        customRender: this.statusTemplate,
      },
    ];
  }

  private setupTableActions(): void {
    this.actions = [
      {
        label: 'Edit',
        icon: 'edit',
        color: 'primary',
        callback: (user: User) => this.editUser(user),
      },
      {
        label: 'Activate',
        icon: 'check-circle',
        color: 'success',
        callback: (user: User) => this.activateUser(user),
        showCondition: (user: User) => !user.isActive,
      },
      {
        label: 'Deactivate',
        icon: 'stop',
        color: 'warning',
        callback: (user: User) => this.deactivateUser(user),
        showCondition: (user: User) => user.isActive,
      },
      {
        label: 'Delete',
        icon: 'delete',
        color: 'danger',
        confirmMessage: 'Are you sure you want to delete this user?',
        callback: (user: User) => this.deleteUser(user),
      },
    ];
  }

  loadUsers(): void {
    this.loading = true;

    const params: UserListParams = {
      page: this.pagination.pageIndex,
      limit: this.pagination.pageSize,
      searchTerm: this.searchValue,
      includeInactive: true,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };

    this.userService
      .getUsers(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.users = response.data;
          this.pagination.total = response.meta.total;
          this.loading = false;
        },
        error: error => {
          this.message.error('Failed to load users');
          console.error('Error loading users:', error);
          this.loading = false;
        },
      });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pagination.pageIndex = event.pageIndex;
    this.pagination.pageSize = event.pageSize;
    this.loadUsers();
  }

  onSearchChange(searchValue: string): void {
    this.searchValue = searchValue;
    this.pagination.pageIndex = 1; // Reset to first page when searching
    this.loadUsers();
  }

  openCreateModal(): void {
    this.selectedUser = null;
    this.showUserModal = true;
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  onSaveUser(userData: CreateUserRequest | UpdateUserRequest): void {
    this.modalLoading = true;

    if (this.selectedUser) {
      // Update existing user
      this.userService
        .updateUser(this.selectedUser.id, userData as UpdateUserRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.message.success('User updated successfully');
            this.showUserModal = false;
            this.modalLoading = false;
            this.loadUsers();
          },
          error: error => {
            this.message.error('Failed to update user');
            console.error('Error updating user:', error);
            this.modalLoading = false;
          },
        });
    } else {
      // Create new user
      this.userService
        .createUser(userData as CreateUserRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.message.success('User created successfully');
            this.showUserModal = false;
            this.modalLoading = false;
            this.loadUsers();
          },
          error: error => {
            this.message.error('Failed to create user');
            console.error('Error creating user:', error);
            this.modalLoading = false;
          },
        });
    }
  }

  activateUser(user: User): void {
    this.userService
      .activateUser(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.message.success('User activated successfully');
          this.loadUsers();
        },
        error: error => {
          this.message.error('Failed to activate user');
          console.error('Error activating user:', error);
        },
      });
  }

  deactivateUser(user: User): void {
    this.userService
      .deactivateUser(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.message.success('User deactivated successfully');
          this.loadUsers();
        },
        error: error => {
          this.message.error('Failed to deactivate user');
          console.error('Error deactivating user:', error);
        },
      });
  }

  deleteUser(user: User): void {
    this.userService
      .deleteUser(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.message.success('User deleted successfully');
          this.loadUsers();
        },
        error: error => {
          this.message.error('Failed to delete user');
          console.error('Error deleting user:', error);
        },
      });
  }
}
