import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MentorManagementService } from '../../../../services/mentor-management.service';
import { MentorWorkload, CourseForManagement } from '../../../../models/course.models';
import { ConfirmDialogComponent } from '../../../../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manager-mentor',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule, 
    MatExpansionModule, MatDialogModule, MatSnackBarModule, MatTooltipModule
  ],
  templateUrl: './manager-mentor.component.html',
  styleUrls: ['./manager-mentor.component.scss']
})
export class ManagerMentorComponent implements OnInit {
  mentors: MentorWorkload[] = [];
  unassignedCourses: CourseForManagement[] = [];
  isLoading = true;
  showAssignModal = false;
  selectedMentor: MentorWorkload | null = null;

  constructor(
    private mentorService: MentorManagementService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.mentorService.getWorkload().subscribe({
      next: (data) => {
        this.mentors = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Lỗi khi tải danh sách Mentor', 'Đóng', { duration: 3000 });
        this.isLoading = false;
      }
    });

    this.mentorService.getUnassignedCourses().subscribe(data => {
      this.unassignedCourses = data;
    });
  }

  openAssignModal(mentor: MentorWorkload): void {
    this.selectedMentor = mentor;
    this.showAssignModal = true;
  }

  closeModal(): void {
    this.showAssignModal = false;
    this.selectedMentor = null;
  }

  assignCourse(course: CourseForManagement): void {
    if (!this.selectedMentor) return;

    this.mentorService.assignMentor(course.courseId, this.selectedMentor.mentorId).subscribe({
      next: () => {
        this.snackBar.open(`Đã gán Mentor ${this.selectedMentor?.fullName} cho khóa học ${course.name}`, 'OK', { duration: 3000 });
        this.loadData();
        this.closeModal();
      },
      error: (err) => {
        this.snackBar.open('Gán thất bại: ' + (err.error?.message || 'Lỗi hệ thống'), 'Đóng', { duration: 3000 });
      }
    });
  }

  confirmRemove(courseId: number, courseName: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Gỡ Mentor',
        message: `Bạn có chắc chắn muốn gỡ Mentor khỏi khóa học "${courseName}" không?`,
        type: 'warning'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mentorService.removeMentor(courseId).subscribe({
          next: () => {
            this.snackBar.open('Đã gỡ Mentor thành công', 'OK', { duration: 3000 });
            this.loadData();
          },
          error: () => this.snackBar.open('Gỡ thất bại', 'Đóng', { duration: 3000 })
        });
      }
    });
  }
}
