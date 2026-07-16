import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../constants';

export interface AuditLogItem {
  Id: number;
  UserId: number | null;
  UserEmail: string | null;
  UserName: string | null;
  Action: string;
  EntityType: string;
  EntityId: string | null;
  Description: string | null;
  IpAddress: string | null;
  Endpoint: string | null;
  HttpMethod: string | null;
  StatusCode: number | null;
  CreatedAt: string;
}

export interface AuditLogDetail extends AuditLogItem {
  OldValues: any;
  NewValues: any;
  UserAgent: string | null;
}

export interface AuditLogResponse {
  total: number;
  items: AuditLogItem[];
  page: number;
  pageSize: number;
}

export interface AuditLogStats {
  totalToday: number;
  totalAll: number;
  byAction: { action: string; count: number }[];
}

export interface AuditLogFilterOptions {
  actions: string[];
  entityTypes: string[];
}

export interface AuditLogQuery {
  page?: number;
  pageSize?: number;
  action?: string;
  entityType?: string;
  userId?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {

  constructor(private http: HttpClient) { }

  getAuditLogs(query: AuditLogQuery = {}): Observable<AuditLogResponse> {
    let params = new HttpParams();
    if (query.page) params = params.set('page', query.page);
    if (query.pageSize) params = params.set('pageSize', query.pageSize);
    if (query.action) params = params.set('action', query.action);
    if (query.entityType) params = params.set('entityType', query.entityType);
    if (query.userId) params = params.set('userId', query.userId);
    if (query.search) params = params.set('search', query.search);
    if (query.dateFrom) params = params.set('dateFrom', query.dateFrom);
    if (query.dateTo) params = params.set('dateTo', query.dateTo);
    return this.http.get<AuditLogResponse>(API_URLS.AUDIT_LOG, { params });
  }

  getStats(): Observable<AuditLogStats> {
    return this.http.get<AuditLogStats>(API_URLS.AUDIT_LOG_STATS);
  }

  getFilterOptions(): Observable<AuditLogFilterOptions> {
    return this.http.get<AuditLogFilterOptions>(API_URLS.AUDIT_LOG_FILTER_OPTIONS);
  }

  getAuditLogById(id: number): Observable<AuditLogDetail> {
    return this.http.get<AuditLogDetail>(`${API_URLS.AUDIT_LOG_DETAIL}/${id}`);
  }
}
