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
import { FilesAcceptDirective, FileUploadModule } from "@iplab/ngx-file-upload";

interface Lesson {
  id: number | string;
  subLessonName: string;
  videoName: string;
}

const ELEMENT_DATA: Lesson[] = [
  { id: 1, subLessonName: 'Laptop Mac Pro', videoName: 'Introduction to Mac Pro' },
  { id: 2, subLessonName: 'Smart Camera XD6', videoName: 'Setting Up Smart Camera' },
  { id: 3, subLessonName: 'Pixi 8 Wireless Airphone', videoName: 'Wireless Audio Basics' },
  { id: 4, subLessonName: 'Jebble Smart Watch', videoName: 'Getting Started with Jebble' },
  { id: 5, subLessonName: 'Smart Watch F8 Pro', videoName: 'Advanced F8 Pro Features' },
  { id: 6, subLessonName: 'Wall Clock Cimbina', videoName: 'Installing Cimbina Clock' },
  { id: 7, subLessonName: 'Galaxo T6 Munsun', videoName: 'Hands-on with Galaxo T6' },
  { id: 8, subLessonName: 'Tagus Airpod x-Zon', videoName: 'Airpod x-Zon Overview' },
  { id: 9, subLessonName: 'Levitating Headphone', videoName: 'Levitating Sound Explained' },
  { id: 10, subLessonName: 'Refreshing Water', videoName: 'Refreshing Water Tech Demo' },
];


@Component({
  selector: 'app-lecturer-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatIcon, DragDropModule, FormsModule]
})
export class LecturerLesson {
  constructor(public dialog: MatDialog) {}

  displayedColumns: string[] = ['id', 'subLessonName', 'videoName', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  searchTerm=''

  drop(event: CdkDragDrop<Lesson[]>) {
    const prev = this.dataSource.data;
    moveItemInArray(prev, event.previousIndex, event.currentIndex);
    this.dataSource.data = [...prev];
  }

  search() {}

  openAddEventDialog(enterAnimationDuration: string, exitAnimationDuration: string, subLesson?: any): void {
    this.dialog.open(CreateCourse, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
        data:{
          lesson: subLesson
        }
    });
  }
}

@Component({
    selector: 'create-course',
    templateUrl: './dialog-create-sub-lesson.html',
    imports: [MatCardModule, MatButtonModule, MatMenuModule, FileUploadModule]
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