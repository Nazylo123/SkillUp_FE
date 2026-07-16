import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningMaterialService, MentorMaterialGroupDto, LearningMaterialDto } from '../../../services/learning-material.service';
import { ApiCourseServices } from '../../../services/course.service';

interface CourseOption { courseId: number; name: string; }

@Component({
  selector: 'app-manager-materials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-materials.component.html',
  styleUrl: './manager-materials.component.scss'
})
export class ManagerMaterialsComponent implements OnInit {

  mentorGroups: MentorMaterialGroupDto[] = [];
  filteredGroups: MentorMaterialGroupDto[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Search/Filter
  searchText = '';

  // Expand/collapse accordion
  expandedMentors = new Set<number>();

  // Assign modal
  showAssignModal = false;
  assigningMaterial: LearningMaterialDto | null = null;
  selectedCourseId: number | null = null;
  courses: CourseOption[] = [];
  isAssigning = false;
  coursesLoading = false;

  // Unassign
  unassigningKey = ''; // materialId-courseId

  constructor(
    private materialService: LearningMaterialService,
    private courseService: ApiCourseServices
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.materialService.getAllByMentor().subscribe({
      next: (data) => {
        this.mentorGroups = data;
        this.filteredGroups = data;
        // Auto-expand all by default
        data.forEach(g => this.expandedMentors.add(g.mentorId));
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Lỗi khi tải danh sách học liệu.';
        this.isLoading = false;
      }
    });
  }

  loadCourses(): void {
    this.coursesLoading = true;
    this.courseService.getCourseListManager(1, 1000).subscribe({ // Lấy nhiều hơn để gán
      next: (data: any) => {
        // data.items là mảng từ backend trả về (CoursePaginatedResponse)
        const items = data.items || data.data || (Array.isArray(data) ? data : []);
        this.courses = items.map((c: any) => ({
          courseId: c.courseId,
          name: c.name + (c.status !== 'Approved' ? ` [${c.status}]` : '')
        }));
        this.coursesLoading = false;
      },
      error: () => {
        this.coursesLoading = false;
      }
    });
  }

  onSearch(): void {
    const q = this.searchText.trim().toLowerCase();
    if (!q) {
      this.filteredGroups = this.mentorGroups;
      return;
    }
    this.filteredGroups = this.mentorGroups
      .map(g => ({
        ...g,
        materials: g.materials.filter(m =>
          m.title.toLowerCase().includes(q) ||
          m.fileName.toLowerCase().includes(q) ||
          m.fileType.toLowerCase().includes(q)
        )
      }))
      .filter(g => g.mentorName.toLowerCase().includes(q) || g.materials.length > 0);
  }

  toggleMentor(mentorId: number): void {
    if (this.expandedMentors.has(mentorId)) {
      this.expandedMentors.delete(mentorId);
    } else {
      this.expandedMentors.add(mentorId);
    }
  }

  isExpanded(mentorId: number): boolean {
    return this.expandedMentors.has(mentorId);
  }

  openAssignModal(material: LearningMaterialDto): void {
    this.assigningMaterial = material;
    this.selectedCourseId = null;
    this.showAssignModal = true;
    this.loadCourses();
  }

  closeAssignModal(): void {
    if (!this.isAssigning) {
      this.showAssignModal = false;
      this.assigningMaterial = null;
    }
  }

  // Lấy courseId đã gán của material hiện tại để loại khỏi dropdown
  getAlreadyAssignedIds(material: LearningMaterialDto): number[] {
    return material.assignedCourses.map(c => c.courseId);
  }

  getAvailableCourses(material: LearningMaterialDto): CourseOption[] {
    const assigned = this.getAlreadyAssignedIds(material);
    return this.courses.filter(c => !assigned.includes(c.courseId));
  }

  submitAssign(): void {
    if (!this.assigningMaterial || !this.selectedCourseId) return;
    this.isAssigning = true;

    this.materialService.assignToCourse(this.assigningMaterial.learningMaterialId, this.selectedCourseId).subscribe({
      next: () => {
        this.isAssigning = false;
        this.showAssignModal = false;
        const courseName = this.courses.find(c => c.courseId === this.selectedCourseId)?.name ?? '';
        this.successMessage = `Đã gán "${this.assigningMaterial?.title}" vào khóa học "${courseName}".`;
        setTimeout(() => this.successMessage = '', 4000);
        this.loadData(); // reload để cập nhật badge
      },
      error: (err) => {
        this.isAssigning = false;
        this.errorMessage = err.error?.message || 'Lỗi khi gán học liệu.';
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  unassign(material: LearningMaterialDto, courseId: number, courseName: string): void {
    if (!confirm(`Bỏ gán "${material.title}" khỏi khóa học "${courseName}"?`)) return;

    const key = `${material.learningMaterialId}-${courseId}`;
    this.unassigningKey = key;

    this.materialService.unassignFromCourse(material.learningMaterialId, courseId).subscribe({
      next: () => {
        this.unassigningKey = '';
        this.successMessage = `Đã bỏ gán khỏi "${courseName}".`;
        setTimeout(() => this.successMessage = '', 3000);
        this.loadData();
      },
      error: () => {
        this.unassigningKey = '';
        this.errorMessage = 'Lỗi khi bỏ gán học liệu.';
      }
    });
  }

  downloadMaterial(id: number, fileName: string): void {
    this.materialService.downloadMaterial(id, fileName);
  }

  getFileTypeColor(fileType: string): string {
    const colors: Record<string, string> = {
      'PDF': '#e74c3c', 'DOC': '#2980b9', 'DOCX': '#2980b9',
      'PPT': '#e67e22', 'PPTX': '#e67e22', 'XLS': '#27ae60',
      'XLSX': '#27ae60', 'TXT': '#7f8c8d', 'RTF': '#7f8c8d',
    };
    return colors[fileType?.toUpperCase()] || '#95a5a6';
  }

  getTotalMaterials(): number {
    return this.mentorGroups.reduce((sum, g) => sum + g.totalMaterials, 0);
  }
}
