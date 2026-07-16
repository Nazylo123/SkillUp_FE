import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MentorWorkload, CourseForManagement } from '../models/course.models';

@Injectable({
  providedIn: 'root'
})
export class MentorManagementService {
  private apiUrl = `${environment.baseUrl.SKILL_UP}/MentorManagement`;

  constructor(private http: HttpClient) {}

  getWorkload(): Observable<MentorWorkload[]> {
    return this.http.get<MentorWorkload[]>(`${this.apiUrl}/workload`);
  }

  getUnassignedCourses(): Observable<CourseForManagement[]> {
    return this.http.get<CourseForManagement[]>(`${this.apiUrl}/unassigned-courses`);
  }

  assignMentor(courseId: number, mentorId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign`, {}, {
      params: { courseId: courseId.toString(), mentorId: mentorId.toString() }
    });
  }

  removeMentor(courseId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${courseId}`);
  }
}
