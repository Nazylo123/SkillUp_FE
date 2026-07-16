import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RagService } from '../../../../../services/rag.service';

@Component({
  selector: 'ai-knowledge-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon style="vertical-align: middle; color: #6259ca;">psychology</mat-icon>
      Upload AI Knowledge - {{ data.courseName }}
    </h2>
    <mat-dialog-content>
      <p class="text-muted" style="margin-bottom: 16px;">
        Upload tài liệu để AI trợ giảng có thể trả lời câu hỏi của học viên về khóa học này.
      </p>
      <mat-form-field appearance="fill" class="w-100 mb-2">
        <mat-label>Tên tài liệu</mat-label>
        <input matInput [(ngModel)]="docTitle" name="title" required>
      </mat-form-field>
      <div style="border: 2px dashed #ccc; border-radius: 8px; text-align: center; padding: 20px; margin-bottom: 16px;">
        <input type="file" (change)="onFileSelected($event)" accept=".pdf,.txt" style="display: none;" #fileInput>
        <button type="button" mat-raised-button color="primary" (click)="fileInput.click()">Chọn file (PDF, TXT)</button>
        <div *ngIf="selectedFile" style="margin-top: 10px; color: green;">
          <mat-icon style="vertical-align: middle;">check_circle</mat-icon>
          {{ selectedFile.name }}
        </div>
      </div>
      <div *ngIf="isUploading" style="margin-bottom: 10px;">
        <p style="color: #6259ca;">Đang xử lý tài liệu cho AI...</p>
      </div>
      <div *ngIf="message" [style.color]="isSuccess ? 'green' : 'red'" style="margin-bottom: 10px;">
        {{ message }}
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Đóng</button>
      <button mat-raised-button color="primary" (click)="upload()" [disabled]="!selectedFile || !docTitle || isUploading">Upload</button>
    </mat-dialog-actions>
  `
})
export class AIKnowledgeDialog {
  docTitle = '';
  selectedFile: File | null = null;
  isUploading = false;
  message = '';
  isSuccess = false;

  constructor(
    public dialogRef: MatDialogRef<AIKnowledgeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ragService: RagService
  ) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.txt'))) {
      this.selectedFile = file;
      this.message = '';
    } else {
      this.message = 'Chỉ hỗ trợ PDF hoặc TXT.';
      this.isSuccess = false;
    }
  }

  upload() {
    if (!this.selectedFile || !this.docTitle) return;
    this.isUploading = true;
    this.message = '';

    this.ragService.uploadDocument(this.selectedFile, this.docTitle, undefined, this.data.courseId).subscribe({
      next: () => {
        this.isUploading = false;
        this.isSuccess = true;
        this.message = 'Upload thành công! AI trợ giảng đã có thêm tài liệu mới.';
        this.selectedFile = null;
        this.docTitle = '';
      },
      error: (err) => {
        this.isUploading = false;
        this.isSuccess = false;
        this.message = 'Lỗi: ' + (err.error?.Message || err.message);
      }
    });
  }
}
