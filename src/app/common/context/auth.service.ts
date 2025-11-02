import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiAuthServices } from '../../services/auth.service';
import { UserInfo } from '../../models/user.models';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiAuthService: ApiAuthServices) {}

  initializeAuth() {
    const token = this.getToken();
    if (token) {
      this.loadUserInfo();
    }
  }

  setToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  setRefreshToken(refreshToken: string) {
    localStorage.setItem('refresh_token', refreshToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  loadUserInfo() : void {
    this.apiAuthService.getUserInfo().subscribe(
      (userInfo: UserInfo) => {
        this.currentUserSubject.next(userInfo);
      },
      error => {
        console.error('Error loading user info:', error);
        this.clearTokens();
      }
    );
  }

  logout() {
    this.clearTokens();
  }
}
