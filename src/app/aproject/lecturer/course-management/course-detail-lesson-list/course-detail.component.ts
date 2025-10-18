import { Component, Inject } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from "@angular/material/icon";
import { MatCard, MatCardHeader, MatCardContent, MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

interface Lesson {
  id: number;
  lessonName: string;
}

const ELEMENT_DATA: Lesson[] = [
  { id: 1, lessonName: 'Laptop Mac Pro' },
  { id: 2, lessonName: 'Smart Camera XD6' },
  { id: 3, lessonName: 'Pixi 8 Wireless Airphone' },
  { id: 4, lessonName: 'Jebble Smart Watch' },
  { id: 5, lessonName: 'Smart Watch F8 Pro' },
  { id: 6, lessonName: 'Wall Clock Cimbina' },
  { id: 7, lessonName: 'Galaxo T6 Munsun' },
  { id: 8, lessonName: 'Tagus Airpod x-Zon' },
  { id: 9, lessonName: 'Levitating Headphone' },
  { id: 10, lessonName: 'Refreshing Water' },
];

@Component({
  selector: 'app-drag-table',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatIcon, DragDropModule, CommonModule, FormsModule]
})
export class LecturerCourseDetail {
  constructor(public dialog: MatDialog, private router: Router) {}

  displayedColumns: string[] = ['id', 'lessonName', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  searchTerm = '';

  drop(event: CdkDragDrop<Lesson[]>) {
    const prev = this.dataSource.data;
    moveItemInArray(prev, event.previousIndex, event.currentIndex);
    this.dataSource.data = [...prev];
  }

  detailLesson(lesson:any) {
    this.router.navigate([`lecturer/courses/lesson/${lesson.id}`])
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