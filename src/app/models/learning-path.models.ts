// Learning Path Models

// Learning Path (Roadmap)
export interface LearningPath {
  learningPathId: number;
  name: string;
  description: string;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

// Learning Path Item (Course trong Path)
export interface LearningPathItem {
  id: number;                    // Learning path item ID
  learningPathId: number;
  courseId: number;
  courseName: string;
  description: string;
  orderIndex: number;            // Thứ tự trong path (0, 1, 2, ...)
  isMandatory: boolean;          // Bắt buộc hay optional
}

// Paginated Learning Paths Response
export interface LearningPathsResponse {
  total: number;
  items: LearningPath[];
  page: number;
  pageSize: number;
}

// Create/Update Learning Path Request
export interface CreateLearningPathRequest {
  name: string;
  description: string;
}

// Create Learning Path Item Request
export interface CreateLearningPathItemRequest {
  courseId: number;
  orderIndex: number;
  isMandatory: boolean;
  description?: string;  // Optional description for this course in the path
}

// Update Learning Path Item Request
export interface UpdateLearningPathItemRequest {
  courseId: number;
  orderIndex: number;
  isMandatory: boolean;
  description?: string;
}

// Reorder Learning Path Item Request
export interface ReorderLearningPathItemRequest {
  newOrderIndex: number;
}
