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

}
