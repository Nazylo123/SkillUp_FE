import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../constants';
import { DocumentModel } from '../models/document.models';
import { Level } from '../models/lookup.model';
import { CourseType } from '../models/lookup.model';

@Injectable({
  providedIn: 'root'
})
export class ApiLookupServices {

  constructor(private http: HttpClient) { }

  getCourseTypes(): Observable<CourseType[]> {
    return this.http.get<CourseType[]>(`${API_URLS.GET_COURSE_TYPES}`);
  }

  createCourseType(name: string): Observable<CourseType> {
    return this.http.post<CourseType>(`${API_URLS.GET_COURSE_TYPES}`, { name });
  }

  updateCourseType(courseTypeId: number, name: string): Observable<CourseType> {
    return this.http.put<CourseType>(`${API_URLS.GET_COURSE_TYPES}/${courseTypeId}`, { name });
  }

  deleteCourseType(courseTypeId: number): Observable<void> {
    return this.http.delete<void>(`${API_URLS.GET_COURSE_TYPES}/${courseTypeId}`);
  }

  getLevels(): Observable<Level[]> {
    return this.http.get<Level[]>(`${API_URLS.GET_LEVELS}`);
  }

  createLevel(name: string): Observable<Level> {
    return this.http.post<Level>(`${API_URLS.GET_LEVELS}`, { name });
  }

  updateLevel(levelId: number, name: string): Observable<Level> {
    return this.http.put<Level>(`${API_URLS.GET_LEVELS}/${levelId}`, { name });
  }

  deleteLevel(levelId: number): Observable<void> {
    return this.http.delete<void>(`${API_URLS.GET_LEVELS}/${levelId}`);
  } 

}