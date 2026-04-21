import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiCourseServices } from '../../../services/course.service';
import { Course } from '../../../models/course.models';

@Component({
  selector: 'app-manager-course-performance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './manager-course-performance.component.html',
  styleUrls: ['./manager-course-performance.component.scss']
})
export class ManagerCoursePerformanceComponent implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'createdBy', 'createdAt', 'level', 'status', 'enrollments'];
  data = new MatTableDataSource<Course>([]);
  searchTerm = '';
  enrollRange = 'all';
  enrollSort: 'asc' | 'desc' = 'desc';
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private courseService: ApiCourseServices,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private getEnrollFilter(): { minEnroll?: number; maxEnroll?: number } {
    switch (this.enrollRange) {
      case '0':
        return { minEnroll: 0, maxEnroll: 0 };
      case '1-10':
        return { minEnroll: 1, maxEnroll: 10 };
      case '11-50':
        return { minEnroll: 11, maxEnroll: 50 };
      case '51+':
        return { minEnroll: 51 };
      default:
        return {};
    }
  }

  loadData(): void {
    const enrollFilter = this.getEnrollFilter();
    this.courseService
      .getCoursePerformanceManager(
        this.currentPage,
        this.pageSize,
        this.searchTerm,
        enrollFilter.minEnroll,
        enrollFilter.maxEnroll,
        this.enrollSort
      )
      .subscribe({
        next: (response) => {
          this.data.data = response.items || [];
          this.totalItems = response.total || 0;
          this.currentPage = response.page || this.currentPage;
          this.pageSize = response.pageSize || this.pageSize;
        },
        error: (error) => {
          this.snack.open(error.error?.message || 'Failed to load course performance', '', {
            duration: 3000,
            panelClass: ['error-snackbar', 'custom-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.data.data = [];
          this.totalItems = 0;
        }
      });
  }

  search(): void {
    this.currentPage = 1;
    if (this.paginator) this.paginator.pageIndex = 0;
    this.loadData();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    if (this.paginator) this.paginator.pageIndex = 0;
    this.loadData();
  }

  onPaginatorChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  getDate(date: string): string {
    return date?.split('T')[0] || '';
  }
}
