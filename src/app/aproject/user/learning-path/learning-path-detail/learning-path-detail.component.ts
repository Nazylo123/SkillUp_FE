import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LearningPathService } from '../../../../services/learning-path.service';
import {
  LearningPath,
  LearningPathItem,
  LearningPathProgressSummary
} from '../../../../models/learning-path.models';
import { firstValueFrom } from 'rxjs';

type CourseStatus = 'completed' | 'in-progress' | 'upcoming';

interface CourseWithStatus extends LearningPathItem {
  status: CourseStatus;
  progress: number;
}

@Component({
  selector: 'app-learning-path-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './learning-path-detail.component.html',
  styleUrl: './learning-path-detail.component.scss'
})
export class LearningPathDetail implements OnInit {
  learningPathId: number | null = null;
  learningPath: LearningPath | null = null;
  courses: CourseWithStatus[] = [];
  progressSummary: LearningPathProgressSummary | null = null;
  isLoading = false;
  isEnrolled = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private learningPathService: LearningPathService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.learningPathId = +params['id'];
        this.loadLearningPathData();
      }
    });
  }

  async loadLearningPathData(): Promise<void> {
    if (!this.learningPathId) return;

    this.isLoading = true;
    try {
      // Load learning path details
      this.learningPath = await firstValueFrom(
        this.learningPathService.getLearningPathById(this.learningPathId)
      );

      // Load courses in the path
      const items = await firstValueFrom(
        this.learningPathService.getLearningPathItems(this.learningPathId, 'asc')
      );

      // Load progress summary
      this.progressSummary = await firstValueFrom(
        this.learningPathService.getProgressSummary(this.learningPathId)
      );

      // Check enrollment status
      await this.checkEnrollmentStatus();

      // Map courses with status
      this.courses = items.map((item, index) => ({
        ...item,
        status: this.getCourseStatus(index),
        progress: this.getCourseProgress(item.courseId)
      }));

    } catch (error) {
      console.error('Error loading learning path:', error);
      this.snackBar.open('Failed to load learning path', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  async checkEnrollmentStatus(): Promise<void> {
    try {
      const enrollments = await firstValueFrom(
        this.learningPathService.getMyEnrollments()
      );
      this.isEnrolled = enrollments.some(
        e => e.learningPathId === this.learningPathId
      );
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  }

  getCourseStatus(index: number): CourseStatus {
    if (!this.progressSummary) return 'upcoming';

    if (index < this.progressSummary.completedCourses) {
      return 'completed';
    } else if (index === this.progressSummary.completedCourses) {
      return 'in-progress';
    } else {
      return 'upcoming';
    }
  }

  getCourseProgress(courseId: number): number {
    // TODO: Implement actual course progress tracking
    // For now, return 100 for completed, 50 for in-progress, 0 for upcoming
    const course = this.courses.find(c => c.courseId === courseId);
    if (!course) return 0;

    if (course.status === 'completed') return 100;
    if (course.status === 'in-progress') return 50;
    return 0;
  }

  get overallProgress(): number {
    return this.progressSummary?.overallProgress || 0;
  }

  get completedCourses(): number {
    return this.progressSummary?.completedCourses || 0;
  }

  get totalCourses(): number {
    return this.progressSummary?.totalCourses || this.courses.length;
  }

  get currentCourse(): CourseWithStatus | undefined {
    return this.courses.find(c => c.status === 'in-progress');
  }

  getStatusIcon(status: CourseStatus): string {
    return status === 'completed' ? 'check_circle' :
           status === 'in-progress' ? 'pending' : 'radio_button_unchecked';
  }

  getStatusClass(status: CourseStatus): string {
    return status;
  }

  async enrollNow(): Promise<void> {
    if (!this.learningPathId) return;

    try {
      await firstValueFrom(
        this.learningPathService.enrollInLearningPath(this.learningPathId)
      );
      this.isEnrolled = true;
      this.snackBar.open('Successfully enrolled in learning path!', 'Close', { duration: 3000 });
      await this.loadLearningPathData();
    } catch (error) {
      console.error('Error enrolling:', error);
      this.snackBar.open('Failed to enroll in learning path', 'Close', { duration: 3000 });
    }
  }

  viewCourse(course: CourseWithStatus): void {
    // Navigate to course detail
    this.router.navigate(['/course', course.courseId]);
  }

  goBack(): void {
    this.router.navigate(['/learning-paths']);
  }
}
