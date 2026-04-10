import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { RagService } from '../../../services/rag.service';

@Component({
  selector: 'app-manager-rag-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatProgressBarModule, MatIconModule],
  template: `
    <div class="breadcrumb-card mb-25 d-md-flex align-items-center justify-content-space-between">
        <h5 class="mb-0">Quản Lý Kho Tri Thức AI (Knowledge Base)</h5>
    </div>

    <div class="row">
        <!-- CARD 1: Sync danh sách khóa học -->
        <div class="col-lg-6 col-md-12">
            <mat-card class="mb-25 tagus-card">
                <mat-card-header>
                    <h5 class="mb-0">📚 Sync Danh Sách Khóa Học</h5>
                </mat-card-header>
                <mat-card-content>
                    <p class="text-muted mb-3">
                        Bấm nút bên dưới để đồng bộ toàn bộ danh sách khóa học (đã duyệt) vào kho tri thức AI. <br>
                        Chatbot ở <strong>trang chủ</strong> sẽ dùng dữ liệu này để tư vấn khóa học cho học viên.
                    </p>

                    <div *ngIf="isSyncing" class="mb-3">
                        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
                        <small class="text-muted d-block mt-1">Đang đồng bộ khóa học vào AI...</small>
                    </div>

                    <div *ngIf="syncMessage" [ngClass]="isSyncSuccess ? 'alert alert-success' : 'alert alert-danger'" class="mb-3">
                        {{syncMessage}}
                    </div>

                    <button mat-raised-button color="accent" (click)="syncCourses()" [disabled]="isSyncing">
                        <mat-icon>sync</mat-icon> Sync Danh Sách Khóa Học Vào AI
                    </button>
                </mat-card-content>
            </mat-card>
        </div>

        <!-- CARD 2: Upload tài liệu hệ thống (system-wide) -->
        <div class="col-lg-6 col-md-12">
            <mat-card class="mb-25 tagus-card">
                <mat-card-header>
                    <h5 class="mb-0">📄 Tải Lên Tài Liệu Hệ Thống</h5>
                </mat-card-header>
                <mat-card-content>
                    <p class="text-muted mb-3">
                        Upload tài liệu chung cho toàn hệ thống (nội quy, chính sách, FAQ...). <br>
                        Dữ liệu này được sử dụng bởi <strong>chatbot trang chủ</strong>.
                    </p>
                    <form (ngSubmit)="upload()">
                        <mat-form-field appearance="fill" class="w-100 mb-2">
                            <mat-label>Tên tài liệu</mat-label>
                            <input matInput [(ngModel)]="title" name="title" required>
                        </mat-form-field>

                        <div class="file-upload-box p-4" style="border: 2px dashed #ccc; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                            <input type="file" (change)="onFileSelected($event)" accept=".pdf,.txt" style="display: none;" #fileInput>
                            <button type="button" mat-raised-button color="primary" (click)="fileInput.click()">Chọn file (PDF, TXT)</button>
                            <div *ngIf="selectedFile" class="mt-3 text-success">
                                <mat-icon style="vertical-align: middle;">check_circle</mat-icon>
                                Đã chọn file: {{selectedFile.name}}
                            </div>
                        </div>

                        <div *ngIf="isUploading" class="mb-3">
                            <mat-progress-bar mode="indeterminate"></mat-progress-bar>
                            <small class="text-muted d-block mt-1">Đang xử lý và băm dữ liệu (Embedding)...</small>
                        </div>

                        <div *ngIf="uploadMessage" [ngClass]="isUploadSuccess ? 'alert alert-success' : 'alert alert-danger'" class="mb-3">
                            {{uploadMessage}}
                        </div>

                        <button mat-raised-button color="primary" type="submit" [disabled]="!selectedFile || !title || isUploading">Tải Lên</button>
                    </form>
                </mat-card-content>
            </mat-card>
        </div>
    </div>
  `
})
export class ManagerRagUploadComponent {
  // Upload
  title = '';
  selectedFile: File | null = null;
  isUploading = false;
  uploadMessage = '';
  isUploadSuccess = false;

  // Sync
  isSyncing = false;
  syncMessage = '';
  isSyncSuccess = false;

  constructor(private ragService: RagService) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.txt')) {
        this.selectedFile = file;
        this.uploadMessage = '';
      } else {
        this.uploadMessage = 'Chỉ hỗ trợ file định dạng PDF hoặc TXT.';
        this.isUploadSuccess = false;
      }
    }
  }

  upload() {
    if (!this.selectedFile || !this.title) return;
    this.isUploading = true;
    this.uploadMessage = '';

    // Upload as system-wide (no courseId)
    this.ragService.uploadDocument(this.selectedFile, this.title).subscribe({
      next: () => {
        this.isUploading = false;
        this.isUploadSuccess = true;
        this.uploadMessage = 'Tải lên thành công! Chatbot đã có thêm dữ liệu mới.';
        this.selectedFile = null;
        this.title = '';
      },
      error: (err) => {
        this.isUploading = false;
        this.isUploadSuccess = false;
        this.uploadMessage = 'Lỗi: ' + (err.error?.Message || err.message);
      }
    });
  }

  syncCourses() {
    this.isSyncing = true;
    this.syncMessage = '';

    this.ragService.syncCourses().subscribe({
      next: (res: any) => {
        this.isSyncing = false;
        this.isSyncSuccess = true;
        this.syncMessage = res.message || `Đã đồng bộ ${res.courseCount} khóa học vào AI.`;
      },
      error: (err) => {
        this.isSyncing = false;
        this.isSyncSuccess = false;
        this.syncMessage = 'Lỗi: ' + (err.error?.Message || err.error || err.message);
      }
    });
  }
}
