import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../constants';
import { Course, CourseCreateEdit, CoursePaginatedResponse, CourseDetail, Lesson } from '../models/course.models';

@Injectable({
  providedIn: 'root'
})
export class ApiCourseServices {

  constructor(private http: HttpClient) { }

  getCourseListCreator(page: number = 1, pageSize: number = 10, searchTerm?: string): Observable<CoursePaginatedResponse<Course>> {
    let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (searchTerm && searchTerm.trim()) {
      params = params.set('search', searchTerm.trim());
    }

    return this.http.get<CoursePaginatedResponse<Course>>(API_URLS.GET_COURSES_CREATOR_LECTURER, { params });
  }

  getCourseById(courseId: number): Observable<CourseDetail> {
    return this.http.get<CourseDetail>(`${API_URLS.GET_COURSE_BY_ID}/${courseId}`);
  }

  createCourse(course: CourseCreateEdit): Observable<Course> {
    const formData = new FormData();
    formData.append('Name', course.name);
    formData.append('Description', course.description as string);
    formData.append('CourseType', course.courseType);
    formData.append('TargetLevel', course.targetLevel);
    formData.append('Duration', course.duration.toString());
    formData.append('Image', course.imageUrl);
    return this.http.post<Course>(API_URLS.CREATE_COURSE, formData);
  }

  updateCourse(courseId: number, course: CourseCreateEdit): Observable<Course> {
    const formData = new FormData();
    formData.append('Name', course.name);
    formData.append('Description', course.description as string);
    formData.append('CourseType', course.courseType);
    formData.append('TargetLevel', course.targetLevel);
    formData.append('Duration', course.duration.toString());
    formData.append('Image', course.imageUrl);
    return this.http.put<Course>(`${API_URLS.UPDATE_COURSE}/${courseId}`, formData);
  }

  getLessons(courseId: number | string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${API_URLS.GET_LESSONS}/${courseId}/lessons`);
  }

  createLesson(courseId: number | string, lesson: Lesson): Observable<Lesson> {
    return this.http.post<Lesson>(`${API_URLS.GET_LESSONS}/${courseId}/lessons`, lesson);
  }

  detailLesson(lessonId: number | string): Observable<Lesson> {
    return this.http.get<Lesson>(`${API_URLS.LESSON}/${lessonId}`);
  }

  updateLesson(lessonId: number, lesson: Lesson): Observable<Lesson> {
    const formData = new FormData();
    formData.append('Title', lesson.title);
    formData.append('Description', lesson.description as string);
    return this.http.put<Lesson>(`${API_URLS.LESSON}/${lessonId}`, formData);
  }

  deleteLesson(lessonId: number | string): Observable<void> {
    return this.http.delete<void>(`${API_URLS.LESSON}/${lessonId}`);
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${API_URLS.DELETE_COURSE}/${courseId}`);
  }

  getLevels(): Observable<string[]> {
    return this.http.get<string[]>(API_URLS.LEVELS);
  }
}