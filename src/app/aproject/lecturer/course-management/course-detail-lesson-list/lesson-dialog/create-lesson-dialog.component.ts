import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiCourseServices } from '../../../../../services/course.service';
import { Lesson } from '../../../../../models/course.models';

@Component({
    selector: 'create-course',
    templateUrl: './dialog-create-lesson.html',
    styleUrls: ['../course-detail.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class CreateCourse implements OnInit {
  fb = inject(FormBuilder);
  
  lessonForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
  });
  
  courseId!: number | string;
  lessonId!: number | string;
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<CreateCourse>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snack: MatSnackBar,
    private courseService: ApiCourseServices
  ) {}
  
  ngOnInit() {
    this.courseId = this.data.courseId;
    this.lessonId = this.data.lesson?.lessonId;
    if (this.lessonId) {
      this.isEdit = true;
      this.courseService.detailLesson(this.lessonId).subscribe((lesson: Lesson) => {
        this.lessonForm.patchValue({
          name: lesson.title,
          description: lesson.description,
        });
      });
    }
  }

  onSubmit() {
    this.lessonForm.markAllAsTouched();
    if (!this.lessonForm.valid) return;

    const payload = {
      title: this.lessonForm.value.name,
      description: this.lessonForm.value.description,
    } as Lesson;
    if (this.isEdit) {
      this.courseService.updateLesson(this.lessonId as number, payload).subscribe({
        next: (lesson: Lesson) => {
          this.snack.open('Lesson updated successfully', '', {
            duration: 3000,
            panelClass: ['success-snackbar', 'custom-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          this.snack.open('Failed to update lesson', '', {
            duration: 3000,
            panelClass: ['error-snackbar', 'custom-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
    } else {
      this.courseService.createLesson(this.courseId, payload).subscribe({
        next: (lesson: Lesson) => {
          this.snack.open('Lesson created successfully', '', {
            duration: 3000,
            panelClass: ['success-snackbar', 'custom-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          this.snack.open('Failed to create lesson', '', {
            duration: 3000,
            panelClass: ['error-snackbar', 'custom-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  close(){
      this.dialogRef.close(true);
  }
}
