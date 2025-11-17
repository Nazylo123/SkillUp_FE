import { QuestionType } from "../enums/api.enums";
import { Quiz } from "./quiz.models";

export interface Course {
    courseId: number;
    courseName: string;
    description: string;
    status: CourseStatus;
    courseType: CourseType;
    imageUrl: string | null;
    duration: number | null;
    level: string;
    createdBy: number;
    createdByName: string;
    createdAt: string;
    lessons: Lesson[];
}

export interface CoursePaginatedResponse<T> {
    page: number;
    pageSize: number;
    total: number;
    items: T[];
}

enum CourseStatus {
    APPROVED = "Approved",
    PENDING = "Pending",
    DRAFT = "Draft",
    REJECTED = "Rejected"
  }
  
  enum CourseType {
    ONBOARDING = "Onboarding",
    TECHNICAL = "Technical",
    SOFT_SKILLS = "SoftSkills",
    MANAGEMENT = "Management"
  }

export interface CourseDetail {
    courseId: number;
    name: string;
    description: string;
    imageUrl: string;
    duration: number;
    courseType: string;
    status: string;
    targetLevel: string;
}

export interface CourseCreateEdit {
    name: string;
    description?: string;
    courseType: string;
    targetLevel: string;
    duration: number;
    imageUrl: File;
}

export interface Lesson {
    lessonId?: number;
    title: string;
    description?: string;
    duration?: string;
    courseId?: number;
    subLessons?: SubLesson[];
}

export interface SubLesson {
    id: number;
    title: string;
    videoUrl?: string;
    videoFile?: File;
    duration?: string;
    description?: string;
    orderIndex?: number;
    contentUrl?: string;
    // quizId?: number;
}

export interface SubLessonCreateEdit {
    name: string;
    videoFile: File | null;
    description?: string;
    // quizId?: number;
}


export interface CourseDetailManager {
    id: number;
    name: string;
    description: string;
    image: string;
    duration: number;
    category: string;
    level: string;
    quizzes?: Quiz[];
}
