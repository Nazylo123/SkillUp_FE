import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LearningPathService } from '../../../../services/learning-path.service';
import { LearningPath } from '../../../../models/learning-path.models';

@Component({
  selector: 'app-learning-path-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './learning-path-list.component.html',
  styleUrls: ['./learning-path-list.component.scss']
})
export class LearningPathListComponent implements OnInit {
  displayedColumns: string[] = ['learningPathId', 'name', 'description', 'createdByName', 'createdAt', 'actions'];
  data: LearningPath[] = [];
  total = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  isLoading = false;

  constructor(
    private learningPathService: LearningPathService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadLearningPaths();
  }

  loadLearningPaths(): void {
    this.isLoading = true;
    this.learningPathService.getLearningPaths(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.data = response.items;
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

  search(): void {
    this.currentPage = 1;
    this.loadLearningPaths();
  }

  onPaginatorChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadLearningPaths();
  }

  createLearningPath(): void {
    this.router.navigate(['/lecturer/learning-paths/create']);
  }

  editLearningPath(path: LearningPath): void {
    this.router.navigate(['/lecturer/learning-paths/edit', path.learningPathId]);
  }

  viewLearningPath(path: LearningPath): void {
    this.router.navigate(['/lecturer/learning-paths/view', path.learningPathId]);
  }

  deleteLearningPath(path: LearningPath): void {
    if (!confirm(`Are you sure you want to delete "${path.name}"?`)) {
      return;
    }

    this.learningPathService.deleteLearningPath(path.learningPathId).subscribe({
      next: () => {
        this.snackBar.open('Learning path deleted successfully', 'Close', { duration: 3000 });
        this.loadLearningPaths();
      },
      error: (error) => {
        console.error('Error deleting learning path:', error);
        this.snackBar.open('Failed to delete learning path', 'Close', { duration: 3000 });
      }
    });
  }
}
