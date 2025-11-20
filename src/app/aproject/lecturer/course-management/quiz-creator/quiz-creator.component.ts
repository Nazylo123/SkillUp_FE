import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuizService } from '../../../../services/quiz.service';
import { QuizCreateRequest, Question, AnswerOption } from '../../../../models/quiz.models';
import { QuestionType } from '../../../../enums/api.enums';

@Component({
  selector: 'app-quiz-creator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './quiz-creator.component.html',
  styleUrls: ['./quiz-creator.component.scss']
})
export class QuizCreatorComponent implements OnInit {
  quizForm: FormGroup;
  QuestionType = QuestionType;
  courseId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  questionTypes = [
    { value: QuestionType.SINGLE_CHOICE, label: 'One answer correct' },
    { value: QuestionType.MULTIPLE_CHOICE, label: 'Multi answer correct' },
    { value: QuestionType.TRUE_FALSE, label: 'True/False' },
    { value: QuestionType.TEXT, label: 'Text' }
  ];

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      attemptLimit: [1, [Validators.required, Validators.min(1)]],
      passScore: [70, [Validators.required, Validators.min(0), Validators.max(100)]],
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Get courseId from route params
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.courseId = parseInt(id, 10);
      }
    });
  }

  getName(ai : number ) :string {
    return `${ai}`
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  getAnswers(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('answers') as FormArray;
  }

  addQuestion(): void {
    const questionGroup = this.fb.group({
      type: [QuestionType.SINGLE_CHOICE, Validators.required],
      question: ['', Validators.required],
      answers: this.fb.array([]),
      textAnswer: ['']
    });

    this.questions.push(questionGroup);
    this.addAnswer(this.questions.length - 1, '', true);
    this.addAnswer(this.questions.length - 1);
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  onQuestionTypeChange(questionIndex: number): void {
    const question = this.questions.at(questionIndex);
    const type = question.get('type')?.value;
    const answers = this.getAnswers(questionIndex);

    answers.clear();

    if (type === QuestionType.TRUE_FALSE) {
      this.addAnswer(questionIndex, 'True', true);
      this.addAnswer(questionIndex, 'False');
    } else if (type === QuestionType.TEXT) {
      question.get('textAnswer')?.setValidators([Validators.required]);
      question.get('textAnswer')?.updateValueAndValidity();
    } else {
      question.get('textAnswer')?.clearValidators();
      question.get('textAnswer')?.updateValueAndValidity();
      this.addAnswer(questionIndex, "", true);
      this.addAnswer(questionIndex);
    }
  }

  addAnswer(questionIndex: number, defaultValue: string = '', isCorrect: boolean = false): void {
    const answers = this.getAnswers(questionIndex);
    const answerGroup = this.fb.group({
      text: [defaultValue, Validators.required],
      isCorrect: [isCorrect]
    });

    answers.push(answerGroup);
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    const answers = this.getAnswers(questionIndex);
    if (answers.length > 1) {
      answers.removeAt(answerIndex);
    }
  }

  onSingleChoiceChange(questionIndex: number, answerIndex: number): void {
    const answers = this.getAnswers(questionIndex);
    answers.controls.forEach((answer, index) => {
      answer.get('isCorrect')?.setValue(index === answerIndex);
    });
  }

  canAddAnswer(questionIndex: number): boolean {
    const question = this.questions.at(questionIndex);
    const type = question.get('type')?.value;
    return type === QuestionType.SINGLE_CHOICE || type === QuestionType.MULTIPLE_CHOICE;
  }

  canRemoveAnswer(questionIndex: number): boolean {
    const answers = this.getAnswers(questionIndex);
    return answers.length > 1;
  }

  isTextQuestion(questionIndex: number): boolean {
    const question = this.questions.at(questionIndex);
    return question.get('type')?.value === QuestionType.TEXT;
  }

  isTrueFalseQuestion(questionIndex: number): boolean {
    const question = this.questions.at(questionIndex);
    return question.get('type')?.value === QuestionType.TRUE_FALSE;
  }

  isSingleChoice(questionIndex: number): boolean {
    const question = this.questions.at(questionIndex);
    return question.get('type')?.value === QuestionType.SINGLE_CHOICE;
  }

  onSubmit(): void {
    if (this.quizForm.valid && this.questions.length > 0) {
      if (!this.courseId) {
        this.snackBar.open('❌ Course ID is missing. Please access this page from a course.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      this.isSubmitting = true;
      const formValue = this.quizForm.value;

      // Transform form data to API format
      const quizRequest: QuizCreateRequest = {
        courseId: this.courseId,
        title: formValue.title,
        passScore: formValue.passScore,
        attemptLimit: formValue.attemptLimit,
        questions: this.transformQuestionsToAPI(formValue.questions)
      };

      console.log('Sending quiz data to API:', quizRequest);

      // Call API to create quiz
      this.quizService.createQuiz(quizRequest).subscribe({
        next: (response) => {
          console.log('Quiz created successfully:', response);
          this.isSubmitting = false;

          this.snackBar.open(
            `✅ Quiz "${response.title}" created successfully with ${response.questions.length} questions!`,
            'Close',
            { duration: 5000, panelClass: ['success-snackbar'] }
          );

          // Navigate back to course detail after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/lecturer/courses', this.courseId]);
          }, 2000);
        },
        error: (error) => {
          console.error('Error creating quiz:', error);
          this.isSubmitting = false;

          const errorMessage = error.error?.message || error.message || 'Failed to create quiz';
          this.snackBar.open(`❌ Error: ${errorMessage}`, 'Close', {
            duration: 7000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      // Validation errors
      let errorMessage = '⚠️ Please fix the following issues:\n\n';

      if (this.questions.length === 0) {
        errorMessage += '• Add at least one question\n';
      }

      if (this.quizForm.get('title')?.hasError('required')) {
        errorMessage += '• Quiz title is required\n';
      }

      if (this.quizForm.get('attemptLimit')?.hasError('required')) {
        errorMessage += '• Attempt limit is required\n';
      }

      if (this.quizForm.get('passScore')?.hasError('required')) {
        errorMessage += '• Pass score is required\n';
      }

      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.markFormGroupTouched(this.quizForm);
    }
  }

  /**
   * Transform form questions to API format
   */
  private transformQuestionsToAPI(formQuestions: any[]): Question[] {
    return formQuestions.map((q, index) => {
      const question: Question = {
        title: q.question,
        questionType: q.type,
        points: 1, // Default 1 point per question
        orderIndex: index,
        answerOptions: []
      };

      // Transform answers to API format
      if (q.type === QuestionType.TEXT) {
        // For text questions, create one answer option with the correct answer
        question.answerOptions = [{
          content: q.textAnswer || '',
          isCorrect: true
        }];
      } else {
        // For choice questions, map answers
        question.answerOptions = q.answers.map((answer: any) => ({
          content: answer.text,
          isCorrect: answer.isCorrect
        }));
      }

      return question;
    });
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
}