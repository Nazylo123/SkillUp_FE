import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../constants';
import {
  AiSettings,
  UpdateAiSettingsRequest
} from '../models/settings.models';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }

  /**
   * Get AI Settings
   * GET /api/settings/ai-settings
   */
  getAiSettings(): Observable<AiSettings> {
    return this.http.get<AiSettings>(API_URLS.GET_AI_SETTINGS);
  }

  /**
   * Update AI Settings
   * PUT /api/settings/ai-settings
   */
  updateAiSettings(request: UpdateAiSettingsRequest): Observable<AiSettings> {
    return this.http.put<AiSettings>(API_URLS.UPDATE_AI_SETTINGS, request);
  }
}
