import { Component, inject, Inject } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DocumentDialog } from './document-dialog/document-dialog.component';
import { CreateSubLesson } from './sub-lesson-dialog/dialog-creat-sublesson';
import { CourseDetail, Lesson, SubLesson } from '../../../../models/course.models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiCourseServices } from '../../../../services/course.service';
import { ConfirmDialogComponent } from '../../../../common/confirm-dialog/confirm-dialog.component';
import { VideoPlayerDialog } from './video-player-dialog/video-player-dialog';
import { QuizResponse } from '../../../../models/quiz.models';
import { QuizService } from '../../../../services/quiz.service';
import { FeedbacksCourseComponent } from "./feedbacks-course/feedbacks-course.component";
import { RagService } from '../../../../services/rag.service';
import { CreateCourse } from './lesson-dialog/create-lesson-dialog.component';
import { ViewQuizDialog } from './quiz-dialog/view-quiz-dialog.component';
import { AIKnowledgeDialog } from './ai-knowledge-dialog/ai-knowledge-dialog.component';
import { LearningMaterialService } from '../../../../services/learning-material.service';


@Component({
  selector: 'app-drag-table',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatIcon, DragDropModule, CommonModule, FormsModule, RouterLink, MatDialogModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatTooltipModule, MatExpansionModule, MatChipsModule, ReactiveFormsModule, FeedbacksCourseComponent, MatIconModule]
})
export class LecturerCourseDetail {
  constructor(public dialog: MatDialog, public router: Router, 
    private route: ActivatedRoute, private courseService: ApiCourseServices, 
    private snack: MatSnackBar, private quizService: QuizService,
    private materialService: LearningMaterialService) {}
  id!: string;

  dataSource = new MatTableDataSource();
  searchTerm = '';
  lessons: Lesson[] = [];
  courseDetail: CourseDetail | null = null;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.getCourseDetail();
  }

  maxLengthText(text: string) : boolean {
    return text.length > 20;
  }

  formatText(text: string) : string {
      return this.maxLengthText(text) ? text.substring(0, 20) + '...' : text;
  }

  getFileTypeColor(fileType: string): string {
    const colors: Record<string, string> = {
      'PDF': '#e74c3c', 'DOC': '#2980b9', 'DOCX': '#2980b9',
      'PPT': '#e67e22', 'PPTX': '#e67e22', 'XLS': '#27ae60',
      'XLSX': '#27ae60', 'TXT': '#7f8c8d', 'RTF': '#7f8c8d',
    };
    return colors[fileType?.toUpperCase()] || '#95a5a6';
  }

  downloadMaterial(id: number, fileName: string): void {
    this.materialService.downloadMaterial(id, fileName);
  }

  getCourseDetail() {

    this.courseService.getCourseById(Number(this.id)).subscribe((courseDetail: CourseDetail) => {
      this.lessons = courseDetail.lessons;
      this.courseDetail = courseDetail;
      
    });
    
  }

  deleteLesson(lessonId: number | string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        type: 'warning',
        title: 'Delete Lesson',
        message: 'Are you sure you want to delete this lesson?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        destructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseService.deleteLesson(lessonId).subscribe({
          next: () => {
          this.getCourseDetail();
          this.snack.open('Lesson deleted successfully', '', {
            duration: 3000,
            panelClass: ['success-snackbar', 'custom-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        },
        error: (error: any) => {
          this.snack.open('Failed to delete lesson', '', {
            duration: 3000,
            panelClass: ['error-snackbar', 'custom-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
      }
    });
  }

  formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
  
    let result = '';
  
    if (h > 0) {
      result += `${h}h`;
    }
    if (m > 0) {
      result += `${m}m`;
    }
    if (s > 0 && h === 0) { 
      result += `${s}s`;
    } else if (s > 0 && h > 0 && m === 0) {
      result += `${s}s`;
    }
  
    if (result === '') {
      return '0s';
    }
  
    return result;
  }

  getTimeAgo(date: string | number) {
    if (!date) {
      return 'never';
    }

    const now = new Date();
    const dateObj = new Date(date);
    const diff = now.getTime() - dateObj.getTime();
    
    if (diff < 0) {
      return 'just now';
    }

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} ${years > 1 ? 'years' : 'year'} ago`;
    } else if (months > 0) {
      return `${months} ${months > 1 ? 'months' : 'month'} ago`;
    } else if (days > 0) {
      return `${days} ${days > 1 ? 'days' : 'day'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours > 1 ? 'hours' : 'hour'} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} ago`;
    } else if (seconds > 5) {
      return `${seconds} ${seconds > 1 ? 'seconds' : 'second'} ago`;
    } else {
      return 'few seconds ago';
    }
}

  isDraftCourse(): boolean {
    return this.courseDetail?.status === 'Draft' || this.courseDetail?.status === 'Rejected';
  }

  isDraftPending(): boolean {
    return this.courseDetail?.status === 'Draft' || this.courseDetail?.status === 'Pending';
  }

  dropLesson(event: CdkDragDrop<Lesson[]>) {
    // Lưu orderIndex của 2 lesson cần swap
    const prev = this.lessons[event.previousIndex];
    const current = this.lessons[event.currentIndex];

    const previousOrderIndex = prev.orderIndex;
    const currentOrderIndex = current.orderIndex;
    
    // Move items in array
    moveItemInArray(this.lessons, event.previousIndex, event.currentIndex);
    
    // Swap orderIndex của 2 lesson
    current.orderIndex = previousOrderIndex;
    prev.orderIndex = currentOrderIndex;
    
    this.courseService.reorderLessons({
      courseId: Number(this.id),
      lessons: this.lessons.map((lesson: Lesson) => ({
        lessonId: lesson.lessonId as number,
        orderIndex: lesson.orderIndex as number
      }))
    }).subscribe({
      next: () => {
        this.snack.open('Lessons reordered successfully', '', {
          duration: 3000,
          panelClass: ['success-snackbar', 'custom-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
      error: (error: any) => {
        this.snack.open('Failed to reorder lessons', '', {
          duration: 3000,
          panelClass: ['error-snackbar', 'custom-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  dropSubLesson(event: CdkDragDrop<SubLesson[]>, lesson: Lesson) {
    if (lesson.subLessons) {
      // Lưu orderIndex của 2 sub-lesson cần swap
      const previousOrderIndex = lesson.subLessons[event.previousIndex].orderIndex;
      const currentOrderIndex = lesson.subLessons[event.currentIndex].orderIndex;
      
      // Swap orderIndex của 2 sub-lesson
      if (previousOrderIndex !== undefined && currentOrderIndex !== undefined) {
        lesson.subLessons[event.currentIndex].orderIndex = previousOrderIndex;
        lesson.subLessons[event.previousIndex].orderIndex = currentOrderIndex;
      }
      
      // Move items in array
      moveItemInArray(lesson.subLessons, event.previousIndex, event.currentIndex);

      this.courseService.reorderSubLessons({
        lessonId: lesson.lessonId as number,
        subLessons: lesson.subLessons.map((subLesson: SubLesson) => ({
          subLessonId: subLesson.id as number,
          orderIndex: subLesson.orderIndex as number
        }))
      }).subscribe({
        next: () => {
          this.snack.open('Sub lessons reordered successfully', '', {
            duration: 3000,
            panelClass: ['success-snackbar', 'custom-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        },
        error: (error: any) => {
          this.snack.open('Failed to reorder sub lessons', '', {
            duration: 3000,
            panelClass: ['error-snackbar', 'custom-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  detailLesson(lesson:any) {
    this.router.navigate([`lecturer/courses/lesson/${lesson.id}`])
  }

  finalQuiz() {
    this.router.navigate([`lecturer/courses/${this.id}/quiz`])
  }

  viewQuiz() {
    // Load full quiz data including questions before opening dialog
    this.quizService.getQuizByCourseId(Number(this.id)).subscribe({
      next: (fullQuizData) => {
        // Open dialog with full data
        this.dialog.open(ViewQuizDialog, {
          width: '900px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          data: fullQuizData
        });
      },
      error: (error) => {
        this.snack.open('Error loading quiz details', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  openAddEventDialog(enterAnimationDuration: string, exitAnimationDuration: string, lesson?: any): void {
    this.dialog.open(CreateCourse, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
        data:{
          lesson, 
          courseId: this.id
        }
    },
    ).afterClosed().subscribe(result => {
      if (result) {
        this.getCourseDetail();
      }
    });
  }

  openDocumentDialog(): void {
    this.dialog.open(DocumentDialog, {
      width: '1000px',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms',
      data: {
        courseId: this.id,
        isDraftCourse: this.isDraftCourse()
      }
    });
  }

  openVideoDialog(subLesson: SubLesson): void {
    this.dialog.open(VideoPlayerDialog, {
        width: '900px',
        maxWidth: '95vw',
        // maxHeight: '90vh',
        data: subLesson,
        panelClass: 'video-dialog-container'
    });
}

  openSubLessonDialog(enterAnimationDuration: string, exitAnimationDuration: string, lesson: Lesson, subLesson?: SubLesson): void {
    const dialogRef = this.dialog.open(CreateSubLesson, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          lesson,
          courseId: this.id,
          load: () => this.getCourseDetail(),
          subLesson
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleSubLessonResult(lesson, result, subLesson);
      }
    });
  }

  completeCourse() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        type: 'warning',
        title: 'Complete Course',
        message: 'Are you sure you want to complete this course?',
        confirmText: 'Complete',
        cancelText: 'Cancel',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.courseService.completeCourse(Number(this.id)).subscribe({
        next: () => {
          this.router.navigate([`lecturer/courses`]);
          this.snack.open('Course completed successfully', '', {
            duration: 3000,
            panelClass: ['success-snackbar', 'custom-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        },
        error: (error: any) => {
          this.snack.open(error.error || 'Failed to complete course', '', {
            duration: 3000,
            panelClass: ['error-snackbar', 'custom-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
    });
  }

  deleteSubLesson(subLessonId: number | string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        type: 'warning',
        title: 'Delete Sub Lesson',
        message: 'Are you sure you want to delete this sub lesson?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        destructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseService.deleteSubLesson(subLessonId).subscribe({
          next: () => {
            this.lessons = this.lessons.map((lesson: Lesson) => {
              if (lesson.subLessons) {
                lesson.subLessons = lesson.subLessons.filter(subLesson => subLesson.id !== subLessonId);
              }
              return lesson;
            });
            this.snack.open('Sub lesson deleted successfully', '', {
              duration: 3000,
              panelClass: ['success-snackbar', 'custom-snackbar'],
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          },
          error: (error: any) => {
            this.snack.open('Failed to delete sub lesson', '', {
              duration: 3000,
              panelClass: ['error-snackbar', 'custom-snackbar'],
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          }
        });
      }
    });
  }

  private handleSubLessonResult(lesson: Lesson, subLessonData: any, existingSubLesson?: SubLesson): void {
    if (!lesson.subLessons) {
      lesson.subLessons = [];
    }

    if (existingSubLesson) {
      const index = lesson.subLessons.findIndex(sl => sl.id === existingSubLesson.id);
      if (index !== -1) {
        lesson.subLessons[index] = { ...existingSubLesson, ...subLessonData };
      }
    } else {
      const newSubLesson: SubLesson = {
        id: Date.now(),
        ...subLessonData
      };
      lesson.subLessons.push(newSubLesson);
    }

    this.lessons = [...this.lessons];
  }

  openAIKnowledgeDialog(): void {
    this.dialog.open(AIKnowledgeDialog, {
      width: '600px',
      data: { courseId: Number(this.id), courseName: this.courseDetail?.name }
    });
  }

  search() {}
}