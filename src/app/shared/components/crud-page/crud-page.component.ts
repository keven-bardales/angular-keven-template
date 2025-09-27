import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { BreadcrumbComponent, Breadcrumb } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-crud-page',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzDividerModule,
    NzPageHeaderModule,
    BreadcrumbComponent
  ],
  template: `
    <div class="crud-page-container">
      <!-- Breadcrumb -->
      <app-breadcrumb
        *ngIf="showBreadcrumb"
        [customBreadcrumbs]="breadcrumbs ?? []">
      </app-breadcrumb>

      <!-- Page Header -->
      <nz-page-header class="page-header" [nzGhost]="false">
        <nz-page-header-title>{{ title }}</nz-page-header-title>
        <nz-page-header-subtitle *ngIf="description">{{ description }}</nz-page-header-subtitle>
        <nz-page-header-extra>
          <nz-space>
            <!-- Custom header actions -->
            <ng-container *ngIf="headerActionsTemplate">
              <ng-container *ngTemplateOutlet="headerActionsTemplate"></ng-container>
            </ng-container>

            <!-- Default Add Button -->
            <button
              *ngIf="showAddButton"
              nz-button
              nzType="primary"
              (click)="onAdd.emit()"
              [disabled]="addButtonDisabled">
              <nz-icon nzType="plus"></nz-icon>
              {{ addButtonText }}
            </button>
          </nz-space>
        </nz-page-header-extra>
      </nz-page-header>

      <!-- Content Area -->
      <div class="crud-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .crud-page-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .page-header {
      background: #fff;
      margin-bottom: 24px;
    }

    .crud-content {
      flex: 1;
      background: #fff;
      padding: 24px;
      border-radius: 4px;
      overflow: auto;
    }

    :host ::ng-deep .ant-page-header {
      padding: 16px 24px;
    }

    :host ::ng-deep .ant-page-header-heading-title {
      font-size: 20px;
      font-weight: 600;
    }

    :host ::ng-deep .ant-page-header-heading-sub-title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 4px;
    }
  `]
})
export class CrudPageComponent {
  @Input() title: string = 'Page Title';
  @Input() description?: string;
  @Input() showBreadcrumb: boolean = true;
  @Input() breadcrumbs?: Breadcrumb[];
  @Input() showAddButton: boolean = true;
  @Input() addButtonText: string = 'Add New';
  @Input() addButtonDisabled: boolean = false;
  @Input() headerActionsTemplate?: TemplateRef<any>;

  @Output() onAdd = new EventEmitter<void>();
}