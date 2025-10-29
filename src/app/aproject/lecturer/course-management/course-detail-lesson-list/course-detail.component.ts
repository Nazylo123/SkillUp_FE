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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

interface Lesson {
  id: number;
  lessonName: string;
}

const ELEMENT_DATA: Lesson[] = [
  { id: 1, lessonName: 'Introduction about Angular' },
  { id: 2, lessonName: 'Angular HTML' },
  { id: 3, lessonName: 'Angular SCSS' },
  { id: 4, lessonName: 'Angular TypeScript' }
];

@Component({
  selector: 'app-drag-table',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatIcon, DragDropModule, CommonModule, FormsModule, RouterLink]
})
export class LecturerCourseDetail {
  constructor(public dialog: MatDialog, public router: Router, private route: ActivatedRoute) {}
  id!: string;

  displayedColumns: string[] = ['id', 'lessonName', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  searchTerm = '';

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    console.log(this.id);
  }

  drop(event: CdkDragDrop<Lesson[]>) {
    const prev = this.dataSource.data;
    moveItemInArray(prev, event.previousIndex, event.currentIndex);
    this.dataSource.data = [...prev];
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