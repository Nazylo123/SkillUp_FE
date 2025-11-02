import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API_URLS } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthServices {

  constructor(private http: HttpClient) { }

  login(payload: any): Observable<any> {
    return this.http.post<any>(API_URLS.LOGIN, payload);
  }

  getUserInfo(): Observable<any> {
    return this.http.get<any>(API_URLS.USER_INFO);
  }

  refreshToken(refreshToken: string) {
    return this.http.post<any>(API_URLS.REFRESH_TOKEN, { refresh_token: refreshToken });
  }

  logout(): Observable<any> {
    return this.http.post<any>(API_URLS.LOGOUT, {});
  }

}
