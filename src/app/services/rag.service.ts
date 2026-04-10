import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface RagChatRequest {
  question: string;
  history?: any[];
  courseId?: number | null;  // null = homepage (course catalog), number = in-course
}

export interface RagChatResponse {
  answer: string;
  sources?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RagService {
  private apiUrl = `${environment.baseUrl.SKILL_UP}/KnowledgeBase`;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  uploadDocument(file: File, title: string, description?: string, courseId?: number): Observable<any> {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('Title', title);
    if (description) {
      formData.append('Description', description);
    }
    if (courseId) {
      formData.append('CourseId', courseId.toString());
    }
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  chat(request: RagChatRequest): Observable<RagChatResponse> {
    return this.http.post<RagChatResponse>(`${this.apiUrl}/chat`, request);
  }

  syncCourses(): Observable<any> {
    return this.http.post(`${this.apiUrl}/sync-courses`, {});
  }
}
