import { QuestionType } from "../enums/api.enums";

export interface QuestionTypeOption {
    value: QuestionType;
    label: string;
}

// ========== BACKEND API MODELS ==========

// Answer Option (from backend)
export interface AnswerOption {
    optionId?: number;
    questionId?: number;
    content: string;
    isCorrect: boolean;
}

// Question (from backend)
export interface Question {
    questionId?: number;
    quizId?: number;
    title: string;
    questionType: string;
    points: number;
    orderIndex: number;
    answerOptions: AnswerOption[];
}

// Quiz Create Request
export interface QuizCreateRequest {
    courseId: number;
    title: string;
    passScore: number;
    attemptLimit: number;
    questions: Question[];
}

// Quiz Response (from backend)
export interface QuizResponse {
    quizId: number;
    courseId: number;
    courseName: string;
    title: string;
    passScore: number;
    attemptLimit: number;
    createdAt: string;
    updatedAt: string;
    questions: Question[];
}

// Batch Create Questions Request
export interface BatchCreateQuestionsRequest {
    questions: Question[];
}

// ========== LEGACY UI MODELS (keep for compatibility) ==========

export interface QuizAnswer {
    text: string;
    isCorrect: boolean;
}

export interface QuizQuestion {
    type: QuestionType;
    question: string;
    answers: QuizAnswer[];
    textAnswer?: string;
}

export interface QuizCreateEdit {
    title: string;
    description?: string;
    duration: number;
    passScore: number;
    questions: QuizQuestion[];
}

export interface Quiz {
    id: number;
    title: string;
    description?: string;
    duration: number;
    passScore: number;
    questions: QuizQuestion[];
    courseId?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface QuizSubmission {
    id: number;
    quizId: number;
    userId: number;
    answers: QuizUserAnswer[];
    score: number;
    passed: boolean;
    startedAt: string;
    submittedAt: string;
    timeSpent: number;
}

export interface QuizUserAnswer {
    questionIndex: number;
    questionType: QuestionType;
    selectedAnswerIndexes?: number[];
    textAnswer?: string;
}

export interface QuizStatistics {
    quizId: number;
    totalAttempts: number;
    passedAttempts: number;
    averageScore: number;
    averageTimeSpent: number;
    questionStatistics: QuestionStatistics[];
}

export interface QuestionStatistics {
    questionIndex: number;
    correctAnswers: number;
    totalAnswers: number;
    correctPercentage: number;
}