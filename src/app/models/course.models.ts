export interface Course {
    id: number;
    name: string;
    description: string;
    image: string;
    duration: number;
    category: string;
    level: string;
}

export interface CourseDetail {
    id: number;
    name: string;
    description: string;
    image: string;
    duration: number;
    category: string;
    level: string;
}

export interface CourseCreateEdit {
    name: string;
    description?: string;
    image: File | null;
    duration: number;
    category: string;
    level: string;
}

export interface Lesson {
    id: number;
    lessonName: string;
    description?: string;
    duration?: string;
    subLessons?: SubLesson[];
}

export interface SubLesson {
    id: number;
    name: string;
    videoUrl?: string;
    duration: string;
    description?: string;
}
