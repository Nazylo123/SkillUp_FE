import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAdmin, PaginatedResponse, UserDetail } from '../models/user.models';
import { API_URLS } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ApiUserServices {

  constructor(private http: HttpClient) { }

  getUserAdminList(page: number = 1, pageSize: number = 10, searchTerm?: string): Observable<PaginatedResponse<UserAdmin>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (searchTerm && searchTerm.trim()) {
      params = params.set('search', searchTerm.trim());
    }

    return this.http.get<PaginatedResponse<UserAdmin>>(API_URLS.GET_USERS_ADMIN_LIST, { params });
  }

  getUserAdminDetail(id: string | number): Observable<UserDetail> {
    return this.http.get<any>(`${API_URLS.GET_USERS_ADMIN_LIST}/${id}`);
  }

  

}
