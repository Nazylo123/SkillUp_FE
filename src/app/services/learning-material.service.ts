import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../constants';

export interface LearningMaterialDto {
  learningMaterialId: number;
  title: string;
  description?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileSizeFormatted: string;
  fileUrl: string;
  publicId?: string;
  mentorId: number;
  mentorName: string;
  createdAt: string;
  updatedAt?: string;
  assignedCourses: AssignedCourseInfoDto[];
}

export interface AssignedCourseInfoDto {
  courseId: number;
  courseName: string;
}

export interface MentorMaterialGroupDto {
  mentorId: number;
  mentorName: string;
  mentorEmail: string;
  totalMaterials: number;
  materials: LearningMaterialDto[];
}

@Injectable({
  providedIn: 'root'
})
export class LearningMaterialService {

  constructor(private http: HttpClient) {}

  // ===== MENTOR =====

  /** Upload học liệu mới */
  uploadMaterial(file: File, title: string, description?: string): Observable<LearningMaterialDto> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (description) formData.append('description', description);
    return this.http.post<LearningMaterialDto>(API_URLS.LM_UPLOAD, formData);
  }

  /** Lấy danh sách học liệu của mentor hiện tại */
  getMyMaterials(): Observable<LearningMaterialDto[]> {
    return this.http.get<LearningMaterialDto[]>(API_URLS.LM_GET_MY);
  }

  /** Xóa học liệu */
  deleteMaterial(id: number): Observable<any> {
    return this.http.delete(`${API_URLS.LM_DELETE}/${id}`);
  }

  // ===== MANAGER =====

  /** Lấy tất cả học liệu phân nhóm theo mentor */
  getAllByMentor(): Observable<MentorMaterialGroupDto[]> {
    return this.http.get<MentorMaterialGroupDto[]>(API_URLS.LM_ALL_BY_MENTOR);
  }

  /** Gán học liệu vào khóa học */
  assignToCourse(materialId: number, courseId: number): Observable<any> {
    return this.http.post(`${API_URLS.LM_ASSIGN}/${materialId}/assign`, { courseId });
  }

  /** Bỏ gán học liệu khỏi khóa học */
  unassignFromCourse(materialId: number, courseId: number): Observable<any> {
    return this.http.delete(`${API_URLS.LM_UNASSIGN}/${materialId}/unassign/${courseId}`);
  }

  // ===== SHARED =====

  /** Lấy học liệu đã gán vào course */
  getMaterialsByCourse(courseId: number): Observable<LearningMaterialDto[]> {
    return this.http.get<LearningMaterialDto[]>(`${API_URLS.LM_BY_COURSE}/${courseId}`);
  }

  /** Lấy URL download (raw URL - chỉ dùng nội bộ) */
  getDownloadUrl(id: number): string {
    return `${API_URLS.LM_DOWNLOAD}/${id}/download`;
  }

  /**
   * Download học liệu với JWT token (dùng HttpClient để gửi Authorization header).
   * Trình duyệt sẽ không tự đính kèm token khi dùng <a href> thông thường.
   */
  downloadMaterial(id: number, fileName: string): void {
    this.http.get(this.getDownloadUrl(id), { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed', err);
        alert('Không thể tải học liệu. Vui lòng thử lại.');
      }
    });
  }
}
