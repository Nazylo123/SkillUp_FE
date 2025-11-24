import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuizService } from '../../../../services/quiz.service';
import { QuizResponse } from '../../../../models/quiz.models';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {
  displayedColumns: string[] = ['quizId', 'title', 'courseName', 'questionsCount', 'passScore', 'attemptLimit', 'createdAt', 'action'];
  data: QuizResponse[] = [];

  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  isLoading: boolean = false;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.isLoading = true;
    this.quizService.getQuizzes(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        console.log('Quizzes loaded:', response);
        this.data = response.items || [];
        this.totalItems = response.totalCount || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading quizzes:', error);
        this.snackBar.open('Error loading quizzes', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  search(): void {
    this.currentPage = 1;
    this.loadQuizzes();
  }

  onPaginatorChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadQuizzes();
  }

  viewQuiz(quiz: QuizResponse): void {
    // Navigate to course detail to view quiz
    this.router.navigate(['/lecturer/courses', quiz.courseId]);
  }

  editQuiz(quiz: QuizResponse): void {
    // Navigate to quiz creator in edit mode
    this.router.navigate(['/lecturer/courses', quiz.courseId, 'quiz']);
  }

  deleteQuiz(quiz: QuizResponse): void {
    if (confirm(`Are you sure you want to delete quiz "${quiz.title}"?`)) {
      this.quizService.deleteQuiz(quiz.quizId).subscribe({
        next: () => {
          this.snackBar.open('Quiz deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadQuizzes();
        },
        error: (error) => {
          console.error('Error deleting quiz:', error);
          this.snackBar.open('Error deleting quiz', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
