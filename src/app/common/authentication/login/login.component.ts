import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiAuthServices } from '../../../services/auth.service';
import { LoadingService } from '../../context/loading.service';
import { AuthService } from '../../context/auth.service';
import { TokenService } from '../../context/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hide = true;
  loginForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private api: ApiAuthServices, 
    private loadingService: LoadingService, 
    private snack: MatSnackBar,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    this.loadingService.onLoading();
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loadingService.offLoading();
      return;
    }

    const { email, password, rememberMe } = this.loginForm.value;

    this.api.login({
        email: email, 
        password: password
    }).subscribe((result: any) => {
        this.loadingService.offLoading();
        console.log(result);
        
        // Lưu access token 
        if (result.accessToken) {
          this.authService.setToken(result.accessToken);
        }
        
        // Lưu refresh token nếu rememberMe = true
        if (rememberMe && result.refreshToken) {
          this.authService.setRefreshToken(result.refreshToken);
        }
        
        // Load thông tin user
        this.authService.loadUserInfo().subscribe(
          (userInfo) => {
            // Setup auto refresh timer
            this.tokenService.setupAutoRefresh();
            
            // Navigate dựa trên role
            this.navigateByRole(userInfo.roles[0]);
            
            this.snack.open("Login successfully", '', { 
              duration: 3000, 
              panelClass: ['success-snackbar', 'custom-snackbar'], 
              horizontalPosition: 'right', 
              verticalPosition: 'top' 
            });
          },
          (userError: any) => {
            console.error('Error loading user info:', userError);
            this.snack.open("Login successful but failed to load user info", '', { 
              duration: 3000, 
              panelClass: ['warn-snackbar', 'custom-snackbar'], 
              horizontalPosition: 'right', 
              verticalPosition: 'top' 
            });
            // Still navigate to dashboard even if user info fails
            this.router.navigate(['/']);
          }
        );
        
        console.log('Login result:', result);
    }, err => {
        this.snack.open(err.error || 'Login failed', '', { 
          duration: 3000, 
          panelClass: ['error-snackbar', 'custom-snackbar'], 
          horizontalPosition: 'right', 
          verticalPosition: 'top' 
        });
        console.error('Login error:', err);
        this.loadingService.offLoading();
    });
  }

  private navigateByRole(role: string) {
    switch (role.toLowerCase()) {
      case 'admin':
        this.router.navigate(['/admin/']);
        break;
      case 'manager':
        this.router.navigate(['/manager/']);
        break;
      case 'lecturer':
        this.router.navigate(['/lecturer/']);
        break;
      case 'user':
      case 'student':
        this.router.navigate(['/']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }

}
