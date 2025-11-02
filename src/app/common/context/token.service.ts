import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { ApiAuthServices } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TokenService {

  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);
  
  constructor(private apiAuthService: ApiAuthServices, private snack: MatSnackBar, private authService: AuthService) {
    this.setupAutoRefresh();
  }

  /**
   * Kiểm tra xem token có hết hạn không
   */
  isTokenExpired(token: string): boolean {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() > expiry;
    } catch (error) {
      return true;
    }
  }

  /**
   * Tự động refresh token khi hết hạn
   */
  refreshToken(): void {
    if (this.refreshTokenInProgress) {
      return;
    }

    const refreshToken = this.authService.getRefreshToken();
    if (!refreshToken) {
      this.authService.clearTokens();
      return;
    }

    this.refreshTokenInProgress = true;
    this.apiAuthService.refreshToken(refreshToken || '').subscribe(
      (response: any) => {
        // Lưu token mới
        this.authService.setToken(response.access_token);
        
        // Nếu có refresh token mới, lưu lại
        if (response.refresh_token) {
          this.authService.setRefreshToken(response.refresh_token);
        }

        this.refreshTokenInProgress = false;
        this.refreshTokenSubject.next(response.access_token as string | null);
      },
      (error: any) => {
        this.refreshTokenInProgress = false;
      })
  }

  /**
   * Lấy token hợp lệ, tự động refresh nếu cần
   */
  getValidToken(): void {
    const token = this.authService.getToken();
    
    if (!token) {
      this.snack.open('No token available', '', { 
        duration: 3000, 
        panelClass: ['error-snackbar', 'custom-snackbar'], 
        horizontalPosition: 'right', 
        verticalPosition: 'top' 
      });
      return;
    }

    if (this.isTokenExpired(token)) {
      this.refreshToken();
    }

  }

  /**
   * Thiết lập auto refresh timer
   */
  setupAutoRefresh(): void {
    const token = this.authService.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const now = Date.now();
      
      // Refresh token 5 phút trước khi hết hạn
      const refreshTime = expiry - now - (5 * 60 * 1000);
      
      if (refreshTime > 0) {
        timer(refreshTime).subscribe(() => {
          this.refreshToken();
          this.setupAutoRefresh(); // Setup next refresh
        });
      }
      console.log('Token refreshed automatically');
    } catch (error) {
      console.error('Error setting up auto refresh:', error);
    } 
  }

}
