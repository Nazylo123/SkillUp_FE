import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiAuthServices } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../context/token.service';

@Component({
    selector: 'app-security',
    imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatMenuModule, RouterLinkActive, MatFormFieldModule, MatInputModule, MatIconModule, MatCheckboxModule, ReactiveFormsModule],
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.scss']
})
export class SecurityComponent {

    hide = true;
    hideNew = true;
    hideConfirm = true;
    changePasswordForm!: FormGroup;
    isSubmitting = false;

    constructor(
        private fb: FormBuilder,
        private api: ApiAuthServices,
        private snack: MatSnackBar,
        private tokenService : TokenService
    ) {
        this.changePasswordForm = this.fb.group({
            oldPassword: ['', [Validators.required, Validators.minLength(6)]],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        });
    }

    getRole(): string {
        return this.tokenService.getRole()?.toLocaleLowerCase() || '';
    }

    getProfileRoute(): string[] {
        const role = this.getRole();
        if (!role) {
            return ['/'];
        }
        return ['/', role, 'profile'];
    }

    getSecurityRoute(): string[] {
        const role = this.getRole();
        if (!role) {
            return ['/'];
        }
        return ['/', role, 'security'];
    }

    onSubmit(): void {
        if (this.changePasswordForm.invalid) {
            this.changePasswordForm.markAllAsTouched();
            return;
        }

        const { oldPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

        // Check if new passwords match
        if (newPassword !== confirmPassword) {
            this.snack.open('Mật khẩu mới không khớp!', '', {
                duration: 3000,
                panelClass: ['error-snackbar', 'custom-snackbar'],
                horizontalPosition: 'right',
                verticalPosition: 'top'
            });
            return;
        }

        // Check if new password is different from old password
        if (oldPassword === newPassword) {
            this.snack.open('Mật khẩu mới phải khác mật khẩu cũ!', '', {
                duration: 3000,
                panelClass: ['error-snackbar', 'custom-snackbar'],
                horizontalPosition: 'right',
                verticalPosition: 'top'
            });
            return;
        }

        this.isSubmitting = true;

        this.api.changePassword({ oldPassword, newPassword }).subscribe({
            next: (result: any) => {
                console.log('Change password success:', result);
                this.isSubmitting = false;
                this.snack.open('Đổi mật khẩu thành công!', '', {
                    duration: 3000,
                    panelClass: ['success-snackbar', 'custom-snackbar'],
                    horizontalPosition: 'right',
                    verticalPosition: 'top'
                });
                this.changePasswordForm.reset();
            },
            error: (err) => {
                console.error('Change password error:', err);
                this.isSubmitting = false;
                let errorMessage = 'Đổi mật khẩu thất bại';

                if (err.status === 400) {
                    errorMessage = err.error?.message || 'Mật khẩu cũ không đúng';
                } else if (err.status === 401) {
                    errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
                } else if (err.error?.message) {
                    errorMessage = err.error.message;
                }

                this.snack.open(errorMessage, '', {
                    duration: 3000,
                    panelClass: ['error-snackbar', 'custom-snackbar'],
                    horizontalPosition: 'right',
                    verticalPosition: 'top'
                });
            }
        });
    }

}