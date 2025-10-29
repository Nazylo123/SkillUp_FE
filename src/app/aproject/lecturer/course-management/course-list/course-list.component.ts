import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Inject, ViewChild } from '@angular/core';
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
        'time',
        'role',
        'status',
        'action',
    ];
    router = inject(Router)

    data = new MatTableDataSource<any>(fakeCourses);
    searchTerm = '';

    constructor(public dialog: MatDialog) {}

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
    styleUrl: './course-list.component.scss',
    imports: [CommonModule]
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
      'Swift',
      'Other',
    ];

    listRoles: string[] = [
      'Intern',
      'Fresher',
      'Junior',
      'Middle',
      'Senior',
      'Other',
    ];


}

const fakeCourses = [
  {
    id: 1,
    name: 'Introduction to React',
    type: 'JavaScript',
    time: 30,
    role: 'Intern',
    status: 'Approved',
  },
  {
    id: 2,
    name: 'Advanced JavaScript',
    type: 'JavaScript',
    time: 45,
    role: 'Junior',
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Spring Boot for Beginners',
    type: 'Java',
    time: 60,
    role: 'Fresher',
    status: 'Approved',
  },
  {
    id: 4,
    name: 'Building APIs with Go',
    type: 'Go',
    time: 25,
    role: 'Middle',
    status: 'Rejected',
  },
  {
    id: 5,
    name: 'Data Science with Python',
    type: 'Python',
    time: 75,
    role: 'Senior',
    status: 'Approved',
  },
  {
    id: 6,
    name: 'Mobile Development with Kotlin',
    type: 'Kotlin',
    time: 40,
    role: 'Fresher',
    status: 'Draft',
  },
  {
    id: 7,
    name: 'Swift for iOS Development',
    type: 'Swift',
    time: 35,
    role: 'Junior',
    status: 'Rejected',
  },
  {
    id: 8,
    name: 'Rust for Systems Programming',
    type: 'Rust',
    time: 50,
    role: 'Senior',
    status: 'Approved',
  },
  {
    id: 9,
    name: 'C# Backend Development',
    type: 'C#',
    time: 42,
    role: 'Middle',
    status: 'Pending',
  },
  {
    id: 10,
    name: 'C++ Game Engine Development',
    type: 'C++',
    time: 65,
    role: 'Other',
    status: 'Draft',
  },
  {
    id: 11,
    name: 'TypeScript in Depth',
    type: 'TypeScript',
    time: 28,
    role: 'Fresher',
    status: 'Rejected',
  },
  {
    id: 12,
    name: 'Python for Data Analysis',
    type: 'Python',
    time: 80,
    role: 'Middle',
    status: 'Approved',
  },
  {
    id: 13,
    name: 'Modern Web Development with TypeScript',
    type: 'TypeScript',
    time: 55,
    role: 'Intern',
    status: 'Draft',
  },
];

