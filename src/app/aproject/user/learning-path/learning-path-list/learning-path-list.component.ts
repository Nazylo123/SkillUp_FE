import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LearningPathService } from '../../../../services/learning-path.service';
import { LearningPath } from '../../../../models/learning-path.models';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-learning-path-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './learning-path-list.component.html',
  styleUrls: ['./learning-path-list.component.scss']
})
export class LearningPathListComponent implements OnInit {
  searchTerm = '';
  isLoading = false;
  learningPaths: LearningPath[] = [];

  // TODO: These will be populated when enrollment APIs are available
  enrolledPathIds: number[] = [];
  pathProgress: { [pathId: number]: number } = {};

  constructor(
    private router: Router,
    private learningPathService: LearningPathService
  ) {}

  ngOnInit(): void {
    this.loadLearningPaths();
  }

  async loadLearningPaths(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await firstValueFrom(
        this.learningPathService.getLearningPaths(1, 100, this.searchTerm)
      );
      this.learningPaths = response.items;

      // TODO: Load enrollment status and progress when APIs are available
      // await this.loadEnrollmentStatus();
      // await this.loadProgress();
    } catch (error) {
      console.error('Error loading learning paths:', error);
    } finally {
      this.isLoading = false;
    }
  }

  get filteredPaths(): LearningPath[] {
    if (!this.searchTerm.trim()) {
      return this.learningPaths;
    }

    const searchLower = this.searchTerm.toLowerCase();
    return this.learningPaths.filter(path =>
      path.name.toLowerCase().includes(searchLower) ||
      path.description.toLowerCase().includes(searchLower)
    );
  }

  get enrolledPaths(): LearningPath[] {
    return this.learningPaths.filter(path =>
      this.enrolledPathIds.includes(path.learningPathId)
    );
  }

  get availablePaths(): LearningPath[] {
    return this.learningPaths.filter(path =>
      !this.enrolledPathIds.includes(path.learningPathId)
    );
  }

  isEnrolled(pathId: number): boolean {
    return this.enrolledPathIds.includes(pathId);
  }

  getProgress(pathId: number): number {
    return this.pathProgress[pathId] || 0;
  }

  async search(): Promise<void> {
    await this.loadLearningPaths();
  }

  viewDetail(path: LearningPath): void {
    this.router.navigate(['/learning-path', path.learningPathId]);
  }

  async enrollPath(path: LearningPath, event: Event): Promise<void> {
    event.stopPropagation();

    // TODO: Implement actual enrollment when API is available
    // For now, just mark as enrolled locally
    this.enrolledPathIds.push(path.learningPathId);
    this.pathProgress[path.learningPathId] = 0;

    console.log('Enrolled in path:', path.name);
    // await this.enrollmentService.enrollInPath(path.learningPathId);
  }

  continuePath(path: LearningPath, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/learning-path', path.learningPathId]);
  }
}
