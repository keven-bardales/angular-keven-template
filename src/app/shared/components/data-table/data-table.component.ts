import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule, NzTableSortFn } from 'ng-zorro-antd/table';
import { NzButtonModule, NzButtonType } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputModule } from 'ng-zorro-antd/input';

export interface ColumnConfig<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  sortable?: boolean;
  sortFn?: NzTableSortFn<T> | boolean | null;
  width?: string;
  align?: 'left' | 'right' | 'center';
  fixed?: 'left' | 'right';
  filterFn?: (value: any, item: T) => boolean;
  filterMultiple?: boolean;
  listOfFilter?: Array<{ text: string; value: any; byDefault?: boolean }>;
  customRender?: TemplateRef<any>;
  showFilter?: boolean;
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: 'primary' | 'danger' | 'warning' | 'success' | 'default';
  callback: (item: any) => void;
  showCondition?: (item: any) => boolean;
  confirmMessage?: string;
  tooltip?: string;
}

export interface PaginationConfig {
  pageIndex: number;
  pageSize: number;
  total: number;
  pageSizeOptions: number[];
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzDividerModule,
    NzDropDownModule,
    NzToolTipModule,
    NzPopconfirmModule,
    NzTagModule,
    NzInputModule
  ],
  template: `
    <div class="table-container">
      <!-- Search Bar -->
      <div class="table-header" *ngIf="showSearch || showExtraActions">
        <div class="search-box" *ngIf="showSearch">
          <nz-input-group [nzSuffix]="suffixIconSearch">
            <input
              nz-input
              [(ngModel)]="searchValue"
              (ngModelChange)="onSearchChange($event)"
              [placeholder]="searchPlaceholder"
            />
          </nz-input-group>
          <ng-template #suffixIconSearch>
            <nz-icon nzType="search"></nz-icon>
          </ng-template>
        </div>

        <div class="extra-actions">
          <ng-content select="[table-extra-actions]"></ng-content>
        </div>
      </div>

      <!-- Table -->
      <nz-table
        #dataTable
        [nzData]="displayData"
        [nzPageIndex]="pagination.pageIndex"
        [nzPageSize]="pagination.pageSize"
        [nzTotal]="isServerSide ? pagination.total : displayData.length"
        [nzShowPagination]="showPagination"
        [nzPaginationPosition]="paginationPosition"
        [nzPageSizeOptions]="pagination.pageSizeOptions"
        [nzShowSizeChanger]="showSizeChanger"
        [nzShowQuickJumper]="showQuickJumper"
        [nzLoading]="loading"
        [nzScroll]="scroll"
        [nzSize]="tableSize"
        [nzBordered]="bordered"
        [nzShowTotal]="totalTemplate"
        [nzFrontPagination]="!isServerSide"
        (nzPageIndexChange)="onPageIndexChange($event)"
        (nzPageSizeChange)="onPageSizeChange($event)"
        (nzCurrentPageDataChange)="onCurrentPageDataChange($any($event))"
      >
        <thead>
          <tr>
            <!-- Checkbox column -->
            <th
              *ngIf="showCheckbox"
              nzWidth="60px"
              [nzChecked]="isAllDisplayDataChecked"
              [nzIndeterminate]="isIndeterminate"
              (nzCheckedChange)="checkAll($event)"
            ></th>

            <!-- Data columns -->
            <th
              *ngFor="let column of columns"
              [nzSortFn]="isServerSide ? null : (column.sortable && column.sortFn ? column!.sortFn : null)"
              [nzSortDirections]="column.sortable ? ['ascend', 'descend', null] : []"
              [nzFilterFn]="isServerSide ? null : (column.filterFn ? column.filterFn : null)"
              [nzFilters]="column.listOfFilter || []"
              [nzFilterMultiple]="column.filterMultiple ?? true"
              [nzWidth]="column.width || null"
              nzAlign="center"
              [nzLeft]="column.fixed === 'left'"
              [nzRight]="column.fixed === 'right'"
              (nzSortOrderChange)="onSortChange(column.key, $event)"
              (nzFilterChange)="onFilterChange(column.key, $event)"
            >
              {{ column.title }}
            </th>

            <!-- Actions column -->
            <th *ngIf="actions.length > 0" nzWidth="150px" nzAlign="center" nzRight="0px">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of dataTable.data">
            <!-- Checkbox column -->
            <td
              *ngIf="showCheckbox"
              [nzChecked]="setOfCheckedId.has(getItemId(item))"
              (nzCheckedChange)="onItemChecked(getItemId(item), $event)"
            ></td>

            <!-- Data columns -->
            <td
              *ngFor="let column of columns"
              nzAlign="center"
              [nzLeft]="column.fixed === 'left'"
              [nzRight]="column.fixed === 'right'"
            >
              <!-- Custom template -->
              <ng-container *ngIf="column.customRender; else defaultRender">
                <ng-container
                  *ngTemplateOutlet="column.customRender; context: { $implicit: item, item: item, column: column }"
                ></ng-container>
              </ng-container>

              <!-- Default render -->
              <ng-template #defaultRender>
                {{ getNestedProperty(item, column.dataIndex || column.key) }}
              </ng-template>
            </td>

            <!-- Actions column -->
            <td *ngIf="actions.length > 0" nzAlign="center" nzRight="0px">
              <nz-space>
                <ng-container *ngFor="let action of getVisibleActions(item)">
                  <button
                    *ngIf="!action.confirmMessage"
                    nz-button
                    nzSize="small"
                    [nzType]="getButtonType(action.color)"
                    [nzDanger]="action.color === 'danger'"
                    nz-tooltip
                    nzTooltipTitle="{{ action.tooltip }}"
                    (click)="action.callback(item)"
                  >
                    <nz-icon *ngIf="action.icon" [nzType]="action.icon"></nz-icon>
                    {{ action.label }}
                  </button>

                  <button
                    *ngIf="action.confirmMessage"
                    nz-button
                    nzSize="small"
                    [nzType]="getButtonType(action.color)"
                    [nzDanger]="action.color === 'danger'"
                    nz-tooltip
                    nzTooltipTitle="{{ action.tooltip }}"
                    nz-popconfirm
                    [nzPopconfirmTitle]="action.confirmMessage"
                    (nzOnConfirm)="action.callback(item)"
                  >
                    <nz-icon *ngIf="action.icon" [nzType]="action.icon"></nz-icon>
                    {{ action.label }}
                  </button>
                </ng-container>
              </nz-space>
            </td>
          </tr>
        </tbody>
      </nz-table>

      <!-- Total Template -->
      <ng-template #totalTemplate let-total let-start="start" let-end="end">
        Showing {{ start }}-{{ end }} of {{ total }} items
      </ng-template>
    </div>
  `,
  styles: [`
    .table-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      gap: 16px;
    }

    .search-box {
      width: 300px;
    }

    .extra-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    :host ::ng-deep .ant-table-wrapper {
      flex: 1;
    }

    :host ::ng-deep .ant-table {
      font-size: 14px;
    }

    :host ::ng-deep .ant-table-thead > tr > th {
      font-weight: 600;
      background: #fafafa;
    }

    :host ::ng-deep .ant-table-tbody > tr:hover > td {
      background: #f5f5f5;
    }

    :host ::ng-deep .ant-btn-sm {
      font-size: 12px;
      height: 24px;
      padding: 0 8px;
    }
  `]
})
export class DataTableComponent<T = any> implements OnInit, OnChanges {
  @Input() data: T[] = [];
  @Input() columns: ColumnConfig<T>[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading: boolean = false;
  @Input() showCheckbox: boolean = false;
  @Input() showSearch: boolean = true;
  @Input() searchPlaceholder: string = 'Search...';
  @Input() showPagination: boolean = true;
  @Input() showSizeChanger: boolean = true;
  @Input() showQuickJumper: boolean = true;
  @Input() showExtraActions: boolean = false;
  @Input() paginationPosition: 'top' | 'bottom' | 'both' = 'bottom';
  @Input() tableSize: 'default' | 'middle' | 'small' = 'default';
  @Input() bordered: boolean = true;
  @Input() scroll: { x?: string; y?: string } = {};
  @Input() isServerSide: boolean = false;
  @Input() pagination: PaginationConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: [10, 20, 50, 100]
  };
  @Input() idKey: string = 'id';

  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() sortChange = new EventEmitter<{ key: string; order: string }>();
  @Output() filterChange = new EventEmitter<{ key: string; values: any[] }>();

  displayData: T[] = [];
  searchValue: string = '';
  setOfCheckedId = new Set<any>();
  isAllDisplayDataChecked = false;
  isIndeterminate = false;

  ngOnInit(): void {
    this.updateDisplayData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['isServerSide']) {
      this.updateDisplayData();
      this.refreshCheckedStatus();
    }
  }

  private updateDisplayData(): void {
    if (this.isServerSide) {
      this.displayData = [...this.data];
    } else {
      // Client-side filtering
      let filteredData = [...this.data];

      if (this.searchValue) {
        filteredData = this.filterBySearch(filteredData);
      }

      this.displayData = filteredData;
    }
  }

  private filterBySearch(data: T[]): T[] {
    const searchLower = this.searchValue.toLowerCase();
    return data.filter(item => {
      return this.columns.some(column => {
        const value = this.getNestedProperty(item, column.dataIndex || column.key);
        return value && value.toString().toLowerCase().includes(searchLower);
      });
    });
  }

  getNestedProperty(obj: any, path: string): string {
    const result = path.split('.').reduce((acc, part) => acc && acc[part], obj);
    return result != null ? String(result) : '';
  }

  getItemId(item: T): any {
    return this.getNestedProperty(item, this.idKey);
  }

  onSearchChange(value: string): void {
    this.searchValue = value;
    if (!this.isServerSide) {
      this.updateDisplayData();
    }
    this.searchChange.emit(value);
  }

  onPageIndexChange(pageIndex: number): void {
    this.pagination.pageIndex = pageIndex;
    this.pageChange.emit({ pageIndex, pageSize: this.pagination.pageSize });
  }

  onPageSizeChange(pageSize: number): void {
    this.pagination.pageSize = pageSize;
    this.pagination.pageIndex = 1;
    this.pageChange.emit({ pageIndex: this.pagination.pageIndex, pageSize });
  }

  onCurrentPageDataChange(_data: T[]): void {
    if (!this.isServerSide) {
      this.refreshCheckedStatus();
    }
  }

  onSortChange(columnKey: string, order: string | null): void {
    if (this.isServerSide && order) {
      this.sortChange.emit({ key: columnKey, order });
    }
  }

  onFilterChange(columnKey: string, values: any[]): void {
    if (this.isServerSide) {
      this.filterChange.emit({ key: columnKey, values });
    }
  }

  checkAll(checked: boolean): void {
    this.displayData.forEach(item => {
      const id = this.getItemId(item);
      if (checked) {
        this.setOfCheckedId.add(id);
      } else {
        this.setOfCheckedId.delete(id);
      }
    });
    this.refreshCheckedStatus();
    this.emitSelectionChange();
  }

  onItemChecked(id: any, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    this.refreshCheckedStatus();
    this.emitSelectionChange();
  }

  private refreshCheckedStatus(): void {
    const displayDataIds = this.displayData.map(item => this.getItemId(item));
    this.isAllDisplayDataChecked = displayDataIds.length > 0 &&
      displayDataIds.every(id => this.setOfCheckedId.has(id));
    this.isIndeterminate = displayDataIds.some(id => this.setOfCheckedId.has(id)) &&
      !this.isAllDisplayDataChecked;
  }

  private emitSelectionChange(): void {
    const selectedItems = this.data.filter(item =>
      this.setOfCheckedId.has(this.getItemId(item))
    );
    this.selectionChange.emit(selectedItems);
  }

  getVisibleActions(item: T): TableAction[] {
    return this.actions.filter(action =>
      !action.showCondition || action.showCondition(item)
    );
  }

  getButtonType(color?: string): NzButtonType {
    const typeMap: Record<string, NzButtonType> = {
      'primary': 'primary',
      'danger': 'default',
      'warning': 'default',
      'success': 'default',
      'default': 'default'
    };
    return typeMap[color || 'default'] || 'default';
  }
}