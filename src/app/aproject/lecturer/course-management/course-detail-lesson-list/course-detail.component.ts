import { Component, Inject } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from "@angular/material/icon";
import { MatCard, MatCardHeader, MatCardContent, MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

interface Lesson {
  id: number;
  lessonName: string;
  description?: string;
  duration?: string;
  subLessons?: SubLesson[];
}

interface SubLesson {
  id: number;
  name: string;
  videoUrl?: string;
  duration: string;
  description?: string;
}

const ELEMENT_DATA: Lesson[] = [
  { 
    id: 1, 
    lessonName: 'Introduction about Angular', 
    description: 'Basic concepts and getting started with Angular framework',
    duration: '45 min',
    subLessons: [
      { id: 1, name: 'What is Angular?', duration: '15 min', description: 'Overview of Angular framework' },
      { id: 2, name: 'Setting up Development Environment', duration: '20 min', description: 'Install Node.js, Angular CLI and VS Code' },
      { id: 3, name: 'Creating First Angular App', duration: '10 min', description: 'Generate and run your first Angular application' }
    ]
  },
  { 
    id: 2, 
    lessonName: 'Angular HTML Templates', 
    description: 'Learn about Angular templates, data binding and directives',
    duration: '60 min',
    subLessons: [
      { id: 4, name: 'Template Syntax', duration: '20 min', description: 'Understanding Angular template syntax' },
      { id: 5, name: 'Data Binding', duration: '25 min', description: 'One-way and two-way data binding' },
      { id: 6, name: 'Structural Directives', duration: '15 min', description: 'Using *ngIf, *ngFor and other directives' }
    ]
  },
  { 
    id: 3, 
    lessonName: 'Angular SCSS Styling', 
    description: 'Styling Angular components with SCSS and CSS',
    duration: '40 min',
    subLessons: [
      { id: 7, name: 'Component Styles', duration: '15 min', description: 'Understanding component-scoped styles' },
      { id: 8, name: 'SCSS Features', duration: '25 min', description: 'Variables, mixins and nested styles' }
    ]
  },
  { 
    id: 4, 
    lessonName: 'Angular TypeScript', 
    description: 'Working with TypeScript in Angular applications',
    duration: '50 min',
    subLessons: [
      { id: 9, name: 'TypeScript Basics', duration: '20 min', description: 'Types, interfaces and classes' },
      { id: 10, name: 'Angular Components', duration: '30 min', description: 'Creating and managing Angular components' }
    ]
  }
];

@Component({
  selector: 'app-drag-table',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatIcon, DragDropModule, CommonModule, FormsModule, RouterLink, MatDialogModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatTooltipModule, MatExpansionModule, MatChipsModule, ReactiveFormsModule]
})
export class LecturerCourseDetail {
  constructor(public dialog: MatDialog, public router: Router, private route: ActivatedRoute) {}
  id!: string;

  displayedColumns: string[] = ['id', 'lessonName', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  searchTerm = '';
  lessons: Lesson[] = ELEMENT_DATA;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    console.log(this.id);
  }

  drop(event: CdkDragDrop<Lesson[]>) {
    const prev = this.dataSource.data;
    moveItemInArray(prev, event.previousIndex, event.currentIndex);
    this.dataSource.data = [...prev];
  }

  dropLesson(event: CdkDragDrop<Lesson[]>) {
    moveItemInArray(this.lessons, event.previousIndex, event.currentIndex);
    // Trigger change detection by creating a new array reference
    this.lessons = [...this.lessons];
  }

  dropSubLesson(event: CdkDragDrop<SubLesson[]>, lesson: Lesson) {
    if (lesson.subLessons) {
      moveItemInArray(lesson.subLessons, event.previousIndex, event.currentIndex);
      // Update the lessons array to trigger change detection
      this.lessons = [...this.lessons];
    }
  }

  detailLesson(lesson:any) {
    this.router.navigate([`lecturer/courses/lesson/${lesson.id}`])
  }

  finalQuiz() {
    this.router.navigate([`lecturer/courses/${this.id}/quiz`])
  }

  openAddEventDialog(enterAnimationDuration: string, exitAnimationDuration: string, lesson?: any): void {
    this.dialog.open(CreateCourse, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
        data:{
          lesson
        }
    });
  }

  openDocumentDialog(): void {
    this.dialog.open(DocumentDialog, {
      width: '1000px',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms'
    });
  }

  openSubLessonDialog(enterAnimationDuration: string, exitAnimationDuration: string, lesson: Lesson, subLesson?: SubLesson): void {
    const dialogRef = this.dialog.open(CreateSubLesson, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          lesson,
          subLesson
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleSubLessonResult(lesson, result, subLesson);
      }
    });
  }

  private handleSubLessonResult(lesson: Lesson, subLessonData: any, existingSubLesson?: SubLesson): void {
    if (!lesson.subLessons) {
      lesson.subLessons = [];
    }

    if (existingSubLesson) {
      // Edit existing subLesson
      const index = lesson.subLessons.findIndex(sl => sl.id === existingSubLesson.id);
      if (index !== -1) {
        lesson.subLessons[index] = { ...existingSubLesson, ...subLessonData };
      }
    } else {
      // Create new subLesson
      const newSubLesson: SubLesson = {
        id: Date.now(), // Simple ID generation
        ...subLessonData
      };
      lesson.subLessons.push(newSubLesson);
    }

    // Update the lessons array to trigger change detection
    this.lessons = [...this.lessons];
  }

  search() {}
}

@Component({
    selector: 'create-course',
    templateUrl: './dialog-create-lesson.html',
    imports: [CommonModule]
    // standalone: false
})
export class CreateCourse {

    constructor(
        public dialogRef: MatDialogRef<CreateCourse>, @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
      console.log('Received data from parent:', this.data);
      // bạn có thể truy cập data.courses, data.title, ...
    }

    close(){
        this.dialogRef.close(true);
    }

}
