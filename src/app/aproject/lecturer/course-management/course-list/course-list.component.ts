import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-lecturer-course-list',
    imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
],
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.scss'],
})
export class LecturerCourseList implements AfterViewInit {
    displayedColumns: string[] = [
        'id',
        'name',
        'type',
        'createdDate',
        'status',
        'action',
    ];

    data = new MatTableDataSource<any>(fakeCourses);
    searchTerm = '';

    constructor(
        public dialog: MatDialog,
        private router: Router
    ) {}

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit() {
      this.data.paginator = this.paginator;

      this.data.filterPredicate = (data, filter) =>
          data.name.toLowerCase().includes(filter) || data.email.toLowerCase().includes(filter);
    }

    search() {
        this.data.filter = this.searchTerm.trim().toLowerCase();
        if (this.data.paginator) {
            this.data.paginator.firstPage();
        }
    }

    detailCourse(id: string| number) {
      this.router.navigate([`/lecturer/courses/${id}`])
    }

    openAddEventDialog(enterAnimationDuration: string, exitAnimationDuration: string, id? : string | number): void {
      this.dialog.open(CreateCourse, {
          width: '600px',
          enterAnimationDuration,
          exitAnimationDuration,
          data:{
            id : id
          }
      });
    }
}

@Component({
    selector: 'create-course',
    templateUrl: './dialog-create-course.html',
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

    listLanguages: string[] = [
      'JavaScript',
      'Python',
      'Java',
      'C#',
      'C++',
      'TypeScript',
      'Go',
      'Rust',
      'Kotlin',
      'Swift'
    ];


}
const fakeCourses = [
  {
    id: 1,
    name: 'Introduction to React',
    type: 'JavaScript',
    createdDate: '2025-01-15',
    status: 'Approved',
  },
  {
    id: 2,
    name: 'Advanced JavaScript',
    type: 'JavaScript',
    createdDate: '2025-02-20',
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Spring Boot for Beginners',
    type: 'Java',
    createdDate: '2025-03-10',
    status: 'Approved',
  },
  {
    id: 4,
    name: 'Building APIs with Go',
    type: 'Go',
    createdDate: '2025-03-15',
    status: 'Rejected',
  },
  {
    id: 5,
    name: 'Data Science with Python',
    type: 'Python',
    createdDate: '2025-04-01',
    status: 'Approved',
  },
  {
    id: 6,
    name: 'Mobile Development with Kotlin',
    type: 'Kotlin',
    createdDate: '2025-04-15',
    status: 'Draft',
  },
  {
    id: 7,
    name: 'Swift for iOS Development',
    type: 'Swift',
    createdDate: '2025-05-01',
    status: 'Rejected',
  },
  {
    id: 8,
    name: 'Rust for Systems Programming',
    type: 'Rust',
    createdDate: '2025-05-15',
    status: 'Approved',
  },
  {
    id: 9,
    name: 'C# Backend Development',
    type: 'C#',
    createdDate: '2025-06-01',
    status: 'Pending',
  },
  {
    id: 10,
    name: 'C++ Game Engine Development',
    type: 'C++',
    createdDate: '2025-06-15',
    status: 'Draft',
  },
  {
    id: 11,
    name: 'TypeScript in Depth',
    type: 'TypeScript',
    createdDate: '2025-07-01',
    status: 'Rejected',
  },
  {
    id: 12,
    name: 'Python for Data Analysis',
    type: 'Python',
    createdDate: '2025-07-15',
    status: 'Approved',
  },
  {
    id: 13,
    name: 'Modern Web Development with TypeScript',
    type: 'TypeScript',
    createdDate: '2025-08-01',
    status: 'Draft',
  },
];

