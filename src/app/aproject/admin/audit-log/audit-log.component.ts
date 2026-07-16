import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  AuditLogService,
  AuditLogItem,
  AuditLogStats,
  AuditLogFilterOptions,
  AuditLogDetail,
  AuditLogQuery
} from '../../../services/audit-log.service';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltip,
    MatDialogModule
  ],
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Mat Table columns
  displayedColumns: string[] = [
    'user',
    'action',
    'entity',
    'apiPath',
    'description',
    'statusCode',
    'ipAddress',
    'createdAt',
    'actions'
  ];

  @ViewChild('detailDialog') detailDialog!: TemplateRef<any>;
  private dialogRef: MatDialogRef<any> | null = null;

  // Data
  logs: AuditLogItem[] = [];
  stats: AuditLogStats | null = null;
  filterOptions: AuditLogFilterOptions = { actions: [], entityTypes: [] };
  selectedLog: AuditLogDetail | null = null;

  // Pagination
  total = 0;
  page = 1;
  pageSize = 10;
  get totalPages(): number { return Math.ceil(this.total / this.pageSize); }
  get pages(): number[] {
    const arr: number[] = [];
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.totalPages, this.page + 2);
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }

  // Filters
  searchText = '';
  selectedAction = '';
  selectedEntityType = '';
  dateFrom = '';
  dateTo = '';

  // UI State
  loading = false;
  detailLoading = false;
  activeTab: 'logs' | 'stats' = 'logs';

  constructor(
    private auditLogService: AuditLogService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadLogs();
    this.loadStats();
    this.loadFilterOptions();

    // Debounce search
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.page = 1;
      this.loadLogs();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLogs(): void {
    this.loading = true;
    const query: AuditLogQuery = {
      page: this.page,
      pageSize: this.pageSize,
    };
    if (this.searchText.trim()) query.search = this.searchText.trim();
    if (this.selectedAction) query.action = this.selectedAction;
    if (this.selectedEntityType) query.entityType = this.selectedEntityType;
    if (this.dateFrom) query.dateFrom = this.dateFrom;
    if (this.dateTo) query.dateTo = this.dateTo;

    this.auditLogService.getAuditLogs(query).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.logs = res.items ?? [];
        this.total = res.total ?? 0;
        this.loading = false;
      },
      error: () => {
        this.logs = [];
        this.total = 0;
        this.loading = false;
      }
    });
  }

  loadStats(): void {
    this.auditLogService.getStats().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (s) => {
        this.stats = {
          totalToday: s.totalToday ?? 0,
          totalAll: s.totalAll ?? 0,
          byAction: s.byAction ?? [],
        };
      },
      error: () => {
        this.stats = { totalToday: 0, totalAll: 0, byAction: [] };
      }
    });
  }

  loadFilterOptions(): void {
    this.auditLogService.getFilterOptions().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (opts) => {
        this.filterOptions = {
          actions: opts.actions ?? [],
          entityTypes: opts.entityTypes ?? [],
        };
      },
      error: () => {
        this.filterOptions = { actions: [], entityTypes: [] };
      }
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchText);
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadLogs();
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedAction = '';
    this.selectedEntityType = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.page = 1;
    this.loadLogs();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.loadLogs();
  }

  openDetail(log: AuditLogItem): void {
    this.detailLoading = true;
    this.selectedLog = null;
    this.dialogRef = this.dialog.open(this.detailDialog, {
      width: '800px',
      panelClass: 'custom-dialog-panel'
    });

    this.auditLogService.getAuditLogById(log.Id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (detail) => {
        this.selectedLog = detail;
        this.detailLoading = false;
      },
      error: () => { this.detailLoading = false; }
    });
  }

  closeDetail(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
    this.selectedLog = null;
  }

  onPaginatorChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadLogs();
  }

  getActionClass(action: string): string {
    const map: Record<string, string> = {
      'CREATE': 'badge-success',
      'UPDATE': 'badge-info',
      'UPDATE_STATUS': 'badge-info',
      'UPDATE_ROLES': 'badge-info',
      'DELETE': 'badge-danger',
      'SUBMIT': 'badge-warning',
      'ACTIVATE': 'badge-warning',
      'LOGIN': 'badge-primary',
      'LOGIN_GOOGLE': 'badge-primary',
      'LOGIN_FAILED': 'badge-danger',
    };
    return map[action] || 'badge-secondary';
  }

  getStatusClass(code: number | null): string {
    if (!code) return 'badge-secondary';
    if (code < 300) return 'badge-success';
    if (code < 400) return 'badge-info';
    if (code < 500) return 'badge-warning';
    return 'badge-danger';
  }

  formatJson(val: unknown): string {
    if (val == null || val === '') return '—';
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return String(val);
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('vi-VN');
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchText || this.selectedAction || this.selectedEntityType || this.dateFrom || this.dateTo);
  }
}
