import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningMaterialService, LearningMaterialDto } from '../../../services/learning-material.service';

@Component({
  selector: 'app-mentor-materials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mentor-materials.component.html',
  styleUrl: './mentor-materials.component.scss'
})
export class MentorMaterialsComponent implements OnInit {

  materials: LearningMaterialDto[] = [];
  isLoading = false;
  isUploading = false;
  errorMessage = '';
  successMessage = '';

  // Upload form state
  showUploadModal = false;
  uploadTitle = '';
  uploadDescription = '';
  selectedFile: File | null = null;
  isDragOver = false;

  // Delete confirm
  deletingId: number | null = null;
  showDeleteConfirm = false;
  materialToDelete: LearningMaterialDto | null = null;

  readonly allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt', '.rtf'];
  readonly maxSizeMB = 100;

  constructor(private materialService: LearningMaterialService) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.isLoading = true;
    this.materialService.getMyMaterials().subscribe({
      next: (data) => {
        this.materials = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Lỗi khi tải danh sách học liệu.';
        this.isLoading = false;
      }
    });
  }

  openUploadModal(): void {
    this.showUploadModal = true;
    this.uploadTitle = '';
    this.uploadDescription = '';
    this.selectedFile = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeUploadModal(): void {
    if (!this.isUploading) {
      this.showUploadModal = false;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  processFile(file: File): void {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      this.errorMessage = `Định dạng không hỗ trợ. Chỉ chấp nhận: ${this.allowedExtensions.join(', ')}`;
      this.selectedFile = null;
      return;
    }
    if (file.size > this.maxSizeMB * 1024 * 1024) {
      this.errorMessage = `File quá lớn. Tối đa ${this.maxSizeMB}MB.`;
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
    this.errorMessage = '';
    // Tự điền title nếu chưa nhập
    if (!this.uploadTitle) {
      this.uploadTitle = file.name.replace(/\.[^/.]+$/, '');
    }
  }

  submitUpload(): void {
    if (!this.selectedFile || !this.uploadTitle.trim()) return;
    this.isUploading = true;
    this.errorMessage = '';

    this.materialService.uploadMaterial(this.selectedFile, this.uploadTitle.trim(), this.uploadDescription.trim() || undefined).subscribe({
      next: (result) => {
        this.isUploading = false;
        this.showUploadModal = false;
        this.successMessage = `Đã upload thành công: "${result.title}"`;
        this.loadMaterials();
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage = err.error?.message || err.error || 'Lỗi khi upload học liệu.';
      }
    });
  }

  confirmDelete(material: LearningMaterialDto): void {
    this.materialToDelete = material;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.materialToDelete = null;
    this.showDeleteConfirm = false;
  }

  doDelete(): void {
    if (!this.materialToDelete) return;
    this.deletingId = this.materialToDelete.learningMaterialId;
    this.materialService.deleteMaterial(this.materialToDelete.learningMaterialId).subscribe({
      next: () => {
        this.materials = this.materials.filter(m => m.learningMaterialId !== this.deletingId);
        this.deletingId = null;
        this.showDeleteConfirm = false;
        this.materialToDelete = null;
        this.successMessage = 'Đã xóa học liệu thành công.';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.deletingId = null;
        this.showDeleteConfirm = false;
        this.errorMessage = 'Lỗi khi xóa học liệu.';
      }
    });
  }

  downloadMaterial(id: number, fileName: string): void {
    this.materialService.downloadMaterial(id, fileName);
  }

  getFileIcon(fileType: string): string {
    const icons: Record<string, string> = {
      'PDF': 'flaticon-pdf-file',
      'DOC': 'flaticon-file-1', 'DOCX': 'flaticon-file-1',
      'PPT': 'flaticon-file', 'PPTX': 'flaticon-file',
      'XLS': 'flaticon-file-2', 'XLSX': 'flaticon-file-2',
      'TXT': 'flaticon-file-1', 'RTF': 'flaticon-file-1',
    };
    return icons[fileType?.toUpperCase()] || 'flaticon-file';
  }

  getFileTypeColor(fileType: string): string {
    const colors: Record<string, string> = {
      'PDF': '#e74c3c',
      'DOC': '#2980b9', 'DOCX': '#2980b9',
      'PPT': '#e67e22', 'PPTX': '#e67e22',
      'XLS': '#27ae60', 'XLSX': '#27ae60',
      'TXT': '#7f8c8d', 'RTF': '#7f8c8d',
    };
    return colors[fileType?.toUpperCase()] || '#95a5a6';
  }
}
