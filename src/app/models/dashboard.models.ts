export interface LecturerStatDto {
  lecturerId: number;
  fullName: string;
  email: string;
  totalCourses: number;
  totalEnrollments: number;
}

export interface LecturerStatsResponse {
  lecturers: LecturerStatDto[];
}

export interface CourseStatDto {
  courseId: number;
  courseName: string;
  enrollments: number;
}

export interface LecturerDashboardDto {
  lecturerId: number;
  fullName: string;
  email: string;
  courses: CourseStatDto[];
  totalEnrollments: number;
}
