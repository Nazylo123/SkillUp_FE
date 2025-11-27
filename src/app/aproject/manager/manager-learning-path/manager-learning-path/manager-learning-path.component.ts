import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LearningPathService } from '../../../../services/learning-path.service';
import { LearningPath } from '../../../../models/learning-path.models';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-manager-learning-path',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './manager-learning-path.component.html',
  styleUrls: ['./manager-learning-path.component.scss']
})
export class ManagerLearningPathComponent implements OnInit {
  // View state
  currentView: 'paths' | 'progress' = 'paths';

  // Stats data (placeholder - waiting for API)
  totalPaths = 0;
  activePaths = 0;
  totalEnrolledUsers = 0;
  averageCompletionRate = 0;

  // Table data
  displayedColumns: string[] = ['path', 'courses', 'creator', 'created', 'actions'];
  dataSource: LearningPath[] = [];
  total = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  isLoading = false;

  constructor(
    private router: Router,
    private learningPathService: LearningPathService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLearningPaths();
    this.loadStats();
  }

  loadLearningPaths(): void {
    this.isLoading = true;
    this.learningPathService.getLearningPaths(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.dataSource = response.items;
        this.total = response.total;
        this.currentPage = response.page;
        this.pageSize = response.pageSize;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading learning paths:', error);
        this.snackBar.open('Failed to load learning paths', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  loadStats(): void {
    // Placeholder - waiting for statistics API
    // TODO: Replace with actual API call when backend implements:
    // GET /api/learning-paths/statistics
    this.learningPathService.getLearningPaths(1, 1000).subscribe({
      next: (response) => {
        this.totalPaths = response.total;
        this.activePaths = response.items.length; // Temporary: all paths considered active
        // totalEnrolledUsers and averageCompletionRate will come from new API
      }
    });
  }

  searchPaths(): void {
    this.currentPage = 1;
    this.loadLearningPaths();
  }

  onPaginatorChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadLearningPaths();
  }

  switchView(view: 'paths' | 'progress'): void {
    this.currentView = view;
  }

  createPath(): void {
    this.router.navigate(['/manager/learning-paths/create']);
  }

  viewPath(path: LearningPath): void {
    this.router.navigate(['/manager/learning-paths/detail', path.learningPathId]);
  }

  editPath(path: LearningPath): void {
    this.router.navigate(['/manager/learning-paths/edit', path.learningPathId]);
  }

  async deletePath(path: LearningPath): Promise<void> {
    if (!confirm(`Are you sure you want to delete "${path.name}"?`)) {
      return;
    }

    try {
      await firstValueFrom(
        this.learningPathService.deleteLearningPath(path.learningPathId)
      );
      this.snackBar.open('Learning path deleted successfully', 'Close', { duration: 3000 });
      this.loadLearningPaths();
      this.loadStats();
    } catch (error) {
      console.error('Error deleting learning path:', error);
      this.snackBar.open('Failed to delete learning path', 'Close', { duration: 3000 });
    }
  }

  // Helper to get course count - will be improved when we have path items loaded
  getCourseCount(_path: LearningPath): string {
    // Placeholder - will need to load items or get from API
    return 'N/A';
  }
}
