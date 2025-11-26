import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../constants';
import {
  LearningPath,
  LearningPathsResponse,
  LearningPathItem,
  CreateLearningPathRequest,
  CreateLearningPathItemRequest,
  UpdateLearningPathItemRequest,
  ReorderLearningPathItemRequest
} from '../models/learning-path.models';

@Injectable({
  providedIn: 'root'
})
export class LearningPathService {

  constructor(private http: HttpClient) { }

  // ========== LEARNING PATHS CRUD ==========

  /**
   * Get paginated learning paths
   * GET /api/learning-paths?q=search&page=1&pageSize=20
   */
  getLearningPaths(page: number = 1, pageSize: number = 10, searchTerm?: string): Observable<LearningPathsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm && searchTerm.trim()) {
      params = params.set('q', searchTerm.trim());
    }

    return this.http.get<LearningPathsResponse>(API_URLS.GET_LEARNING_PATHS, { params });
  }

  /**
   * Get learning path detail by ID
   * GET /api/learning-paths/{id}
   */
  getLearningPathById(id: number): Observable<LearningPath> {
    return this.http.get<LearningPath>(`${API_URLS.GET_LEARNING_PATH_BY_ID}/${id}`);
  }

  /**
   * Create new learning path
   * POST /api/learning-paths
   */
  createLearningPath(data: CreateLearningPathRequest): Observable<LearningPath> {
    return this.http.post<LearningPath>(API_URLS.CREATE_LEARNING_PATH, data);
  }

  /**
   * Update learning path
   * PUT /api/learning-paths/{id}
   */
  updateLearningPath(id: number, data: CreateLearningPathRequest): Observable<LearningPath> {
    return this.http.put<LearningPath>(`${API_URLS.UPDATE_LEARNING_PATH}/${id}`, data);
  }

  /**
   * Delete learning path
   * DELETE /api/learning-paths/{id}
   */
  deleteLearningPath(id: number): Observable<any> {
    return this.http.delete(`${API_URLS.DELETE_LEARNING_PATH}/${id}`);
  }

  /**
   * Restore deleted learning path
   * PATCH /api/learning-paths/{id}/restore
   */
  restoreLearningPath(id: number): Observable<any> {
    return this.http.patch(`${API_URLS.RESTORE_LEARNING_PATH}/${id}/restore`, {});
  }

  // ========== LEARNING PATH ITEMS (COURSES) ==========

  /**
   * Get learning path items (courses in path)
   * GET /api/learning-paths/{learningPathId}/items?order=asc
   */
  getLearningPathItems(learningPathId: number, order: 'asc' | 'desc' = 'asc'): Observable<LearningPathItem[]> {
    const params = new HttpParams().set('order', order);
    return this.http.get<LearningPathItem[]>(
      `${API_URLS.GET_LEARNING_PATH_ITEMS}/${learningPathId}/items`,
      { params }
    );
  }

  /**
   * Create new learning path item (add course to path)
   * POST /api/learning-paths/{learningPathId}/items
   */
  createLearningPathItem(learningPathId: number, data: CreateLearningPathItemRequest): Observable<LearningPathItem> {
    return this.http.post<LearningPathItem>(
      `${API_URLS.CREATE_LEARNING_PATH_ITEM}/${learningPathId}/items`,
      data
    );
  }

  /**
   * Update learning path item
   * PUT /api/learning-path-items/{id}
   */
  updateLearningPathItem(id: number, data: UpdateLearningPathItemRequest): Observable<LearningPathItem> {
    return this.http.put<LearningPathItem>(`${API_URLS.UPDATE_LEARNING_PATH_ITEM}/${id}`, data);
  }

  /**
   * Delete learning path item (remove course from path)
   * DELETE /api/learning-path-items/{id}
   */
  deleteLearningPathItem(id: number): Observable<any> {
    return this.http.delete(`${API_URLS.DELETE_LEARNING_PATH_ITEM}/${id}`);
  }

  /**
   * Reorder learning path item
   * PATCH /api/learning-path-items/{id}/order
   */
  reorderLearningPathItem(id: number, newOrderIndex: number): Observable<any> {
    return this.http.patch(`${API_URLS.REORDER_LEARNING_PATH_ITEM}/${id}/order`, {
      newOrderIndex
    });
  }
}
